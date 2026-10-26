import { Router, Response } from 'express';
import crypto from 'crypto';
import prisma from '../prisma.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Helper to generate a clean voucher code: TB-RED-XXXX-YYYY
function generateVoucherCode(): string {
  const part1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const part2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `TB-RED-${part1}-${part2}`;
}

// 1. Get all active redemption options
router.get('/options', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;

    const where: any = {};
    // By default, members only see active or out of stock options
    if (req.user?.role !== 'ADMIN') {
      where.status = { in: ['ACTIVE', 'OUT_OF_STOCK'] };
    }

    if (category && typeof category === 'string' && category !== 'ALL') {
      where.category = category;
    }

    if (search && typeof search === 'string' && search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { description: { contains: search.trim() } },
        { partnerName: { contains: search.trim() } }
      ];
    }

    const options = await prisma.redemptionOption.findMany({
      where,
      orderBy: [
        { status: 'asc' },
        { creditCost: 'asc' }
      ]
    });

    res.json(options);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get member's personal redemption history
router.get('/my-history', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const redemptions = await prisma.redemption.findMany({
      where: { userId },
      include: {
        redemptionOption: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(redemptions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Redeem an option with available time credits (Atomic transaction)
router.post('/redeem/:optionId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const optionId = req.params.optionId as string;

    // Fetch user and option
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const option = await prisma.redemptionOption.findUnique({
      where: { id: optionId }
    });

    if (!option) {
      res.status(404).json({ error: 'Redemption option not found' });
      return;
    }

    if (option.status !== 'ACTIVE' || option.quantityRemaining <= 0) {
      res.status(400).json({ error: 'This option is currently out of stock or unavailable.' });
      return;
    }

    if (user.creditBalance < option.creditCost) {
      res.status(400).json({
        error: `Insufficient available credits. You have ${user.creditBalance.toFixed(1)} credits, but this perk requires ${option.creditCost.toFixed(1)} credits.`
      });
      return;
    }

    const voucherCode = generateVoucherCode();

    // Execute atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct user balance
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          creditBalance: { decrement: option.creditCost }
        }
      });

      // 2. Decrement inventory
      const newRemaining = option.quantityRemaining - 1;
      const updatedOption = await tx.redemptionOption.update({
        where: { id: optionId },
        data: {
          quantityRemaining: newRemaining,
          status: newRemaining === 0 ? 'OUT_OF_STOCK' : option.status
        }
      });

      // 3. Create redemption record with unique voucher code
      const redemption = await tx.redemption.create({
        data: {
          userId,
          redemptionOptionId: option.id,
          creditsSpent: option.creditCost,
          voucherCode,
          status: 'ACTIVE'
        },
        include: {
          redemptionOption: true
        }
      });

      // 4. Record immutable ledger transaction
      const transaction = await tx.creditTransaction.create({
        data: {
          fromUserId: userId,
          toUserId: null,
          amount: option.creditCost,
          type: 'REDEEMED',
          description: `Redeemed: ${option.title} (Voucher: ${voucherCode})`
        }
      });

      return { updatedUser, updatedOption, redemption, transaction };
    });

    res.status(201).json({
      message: `Successfully redeemed "${option.title}" for ${option.creditCost.toFixed(1)} time credits!`,
      redemption: result.redemption,
      remainingBalance: result.updatedUser.creditBalance
    });
  } catch (error: any) {
    console.error('Redeem error:', error);
    res.status(500).json({ error: error.message || 'Redemption failed' });
  }
});

// 4. Admin: Create a new redemption option
router.post('/options', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      category,
      creditCost,
      quantityTotal,
      partnerName,
      expiryDate,
      imageUrl
    } = req.body;

    if (!title || !description || !category || creditCost === undefined) {
      res.status(400).json({ error: 'Title, description, category, and creditCost are required.' });
      return;
    }

    const qty = Number(quantityTotal) || 50;

    const newOption = await prisma.redemptionOption.create({
      data: {
        title,
        description,
        category,
        creditCost: Number(creditCost),
        quantityTotal: qty,
        quantityRemaining: qty,
        status: 'ACTIVE',
        partnerName: partnerName || null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        imageUrl: imageUrl || null
      }
    });

    res.status(201).json(newOption);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Admin: Update a redemption option
router.put('/options/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const {
      title,
      description,
      category,
      creditCost,
      quantityRemaining,
      status,
      partnerName,
      expiryDate,
      imageUrl
    } = req.body;

    const updated = await prisma.redemptionOption.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(creditCost !== undefined && { creditCost: Number(creditCost) }),
        ...(quantityRemaining !== undefined && { quantityRemaining: Number(quantityRemaining) }),
        ...(status && { status }),
        ...(partnerName !== undefined && { partnerName }),
        ...(expiryDate !== undefined && { expiryDate: expiryDate ? new Date(expiryDate) : null }),
        ...(imageUrl !== undefined && { imageUrl })
      }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Admin: Delete or pause a redemption option
router.delete('/options/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    // Check if there are existing redemptions
    const redemptionCount = await prisma.redemption.count({ where: { redemptionOptionId: id } });

    if (redemptionCount > 0) {
      // Soft-delete / pause if already has redemptions to preserve referential integrity
      const paused = await prisma.redemptionOption.update({
        where: { id },
        data: { status: 'PAUSED' }
      });
      res.json({ message: 'Option has existing redemptions and was paused.', option: paused });
      return;
    }

    await prisma.redemptionOption.delete({ where: { id } });
    res.json({ message: 'Redemption option deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Admin / Partner: Verify and mark voucher as USED
router.patch('/verify/:voucherCode', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const voucherCode = (req.params.voucherCode as string).toUpperCase().trim();

    const redemption = await prisma.redemption.findUnique({
      where: { voucherCode },
      include: {
        user: { select: { email: true, profile: { select: { fullName: true } } } },
        redemptionOption: true
      }
    });

    if (!redemption) {
      res.status(404).json({ error: 'Invalid voucher code.' });
      return;
    }

    if (redemption.status === 'USED') {
      res.status(400).json({
        error: `Voucher was already redeemed on ${redemption.usedAt ? new Date(redemption.usedAt).toLocaleString() : 'a previous date'}.`
      });
      return;
    }

    const updated = await prisma.redemption.update({
      where: { voucherCode: redemption.voucherCode },
      data: {
        status: 'USED',
        usedAt: new Date()
      },
      include: {
        user: { select: { email: true, profile: { select: { fullName: true } } } },
        redemptionOption: true
      }
    });

    res.json({
      message: `Voucher verified! Successfully marked "${redemption.redemptionOption.title}" as USED.`,
      redemption: updated
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
