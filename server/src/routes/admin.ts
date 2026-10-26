import { Router, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard overview stats
router.get('/stats', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalListings,
      totalBookings,
      completedBookings,
      openReports,
      totalTransactions,
      communityPool,
      totalRedemptions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count({ where: { status: 'ACTIVE' } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.report.count({ where: { status: 'OPEN' } }),
      prisma.creditTransaction.aggregate({
        _sum: { amount: true },
        where: { type: 'SERVICE_EXCHANGE' }
      }),
      prisma.communityPool.findFirst({
        where: { id: 'default-pool' }
      }),
      prisma.redemption.count()
    ]);

    res.json({
      totalUsers,
      activeListings: totalListings,
      totalBookings,
      completedBookings,
      openReports,
      totalCreditsTransferred: totalTransactions._sum.amount || 0,
      communityPoolBalance: communityPool?.currentBalance || 0,
      totalRedemptions
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// User management: List all users
router.get('/users', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        _count: {
          select: {
            listings: true,
            requestedBookings: true,
            helperBookings: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user status (e.g. SUSPEND or ACTIVATE)
router.patch('/users/:userId/status', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const { status } = req.body; // 'ACTIVE', 'SUSPENDED', 'PENDING'

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { status }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin credit adjustment with audit trail
router.post('/users/:userId/adjust-credits', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const { amount, reason } = req.body;

    if (amount === undefined || !reason) {
      res.status(400).json({ error: 'Amount and reason are required' });
      return;
    }

    const adjAmount = Number(amount);

    const [updatedUser, tx] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { creditBalance: { increment: adjAmount } }
      }),
      prisma.creditTransaction.create({
        data: {
          toUserId: userId,
          amount: Math.abs(adjAmount),
          type: 'ADMIN_ADJUSTMENT',
          description: `Admin adjustment: ${reason} (${adjAmount > 0 ? '+' : ''}${adjAmount} credits)`
        }
      })
    ]);

    res.json({ user: updatedUser, transaction: tx });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Categories & Skills Management
router.post('/categories', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, icon } = req.body;
    const category = await prisma.category.create({
      data: { name, description, icon: icon || 'Briefcase', active: true }
    });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/skills', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, categoryId } = req.body;
    const skill = await prisma.skill.create({
      data: { name, categoryId }
    });
    res.status(201).json(skill);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Moderation & Reports
router.get('/reports', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        reporter: { select: { id: true, email: true, profile: { select: { fullName: true } } } },
        targetUser: { select: { id: true, email: true, profile: { select: { fullName: true } } } },
        booking: {
          select: {
            id: true,
            status: true,
            listing: { select: { title: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Resolve a report
router.patch('/reports/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status, resolutionNotes } = req.body;

    const report = await prisma.report.update({
      where: { id },
      data: {
        status,
        resolutionNotes
      }
    });

    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Categories list for Admin multiplier governance
router.get('/categories', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { listings: true } } },
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Configure category multiplier eligibility and maximum cap (up to 1.5x for MVP)
router.patch('/categories/:id/multiplier-config', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { multiplierEligible, maxMultiplier, reason } = req.body;
    const adminId = req.user!.id;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    const cap = Math.min(1.5, Math.max(1.0, Number(maxMultiplier) || 1.5));
    const isEligible = multiplierEligible !== undefined ? Boolean(multiplierEligible) : category.multiplierEligible;

    const updated = await prisma.category.update({
      where: { id },
      data: {
        multiplierEligible: isEligible,
        maxMultiplier: cap
      }
    });

    // Create immutable audit log
    await prisma.adminAuditLog.create({
      data: {
        adminId,
        action: 'CATEGORY_MULTIPLIER_CONFIG',
        targetType: 'CATEGORY',
        targetId: id,
        reason: reason || 'Admin updated category multiplier configuration.',
        oldValue: `Eligible: ${category.multiplierEligible}, Max: ${category.maxMultiplier}x`,
        newValue: `Eligible: ${isEligible}, Max: ${cap}x`
      }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin multiplier approval, adjustment, or dispute decision with mandatory audit log
router.post('/audit-logs/multiplier-decision', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const adminId = req.user!.id;
    const { targetType, targetId, action, reason, newMultiplier } = req.body;

    if (!targetType || !targetId || !reason) {
      res.status(400).json({ error: 'targetType, targetId, and reason are required' });
      return;
    }

    let oldValue = '';
    let newValue = '';

    if (targetType === 'LISTING') {
      const listing = await prisma.listing.findUnique({ where: { id: targetId } });
      if (!listing) {
        res.status(404).json({ error: 'Listing not found' });
        return;
      }
      oldValue = `${listing.multiplier}x (${listing.complexityLevel})`;
      if (newMultiplier !== undefined) {
        const updated = await prisma.listing.update({
          where: { id: targetId },
          data: { multiplier: Number(newMultiplier) }
        });
        newValue = `${updated.multiplier}x`;
      } else {
        newValue = action;
      }
    } else if (targetType === 'BOOKING') {
      const booking = await prisma.booking.findUnique({ where: { id: targetId } });
      if (!booking) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }
      oldValue = `${booking.agreedMultiplier}x`;
      if (newMultiplier !== undefined) {
        const finalAmt = booking.durationHours * Number(newMultiplier);
        const updated = await prisma.booking.update({
          where: { id: targetId },
          data: {
            agreedMultiplier: Number(newMultiplier),
            finalCreditAmount: finalAmt
          }
        });
        newValue = `${updated.agreedMultiplier}x (${finalAmt.toFixed(1)} cr)`;
      } else {
        newValue = action;
      }
    }

    const auditLog = await prisma.adminAuditLog.create({
      data: {
        adminId,
        action: action || 'MULTIPLIER_DECISION',
        targetType,
        targetId,
        reason,
        oldValue,
        newValue
      },
      include: {
        admin: { select: { email: true, profile: { select: { fullName: true } } } }
      }
    });

    res.json(auditLog);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve audit logs
router.get('/audit-logs', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await prisma.adminAuditLog.findMany({
      include: {
        admin: { select: { id: true, email: true, profile: { select: { fullName: true } } } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

