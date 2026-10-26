import { Router, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get member wallet summary and transaction history
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        creditBalance: true,
        profile: {
          select: {
            fullName: true,
            completedCount: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get all transactions where user was sender or recipient
    const transactions = await prisma.creditTransaction.findMany({
      where: {
        OR: [
          { fromUserId: userId },
          { toUserId: userId }
        ]
      },
      include: {
        fromUser: { select: { id: true, email: true, profile: { select: { fullName: true } } } },
        toUser: { select: { id: true, email: true, profile: { select: { fullName: true } } } },
        booking: {
          select: {
            id: true,
            listing: { select: { title: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate total earned vs total spent
    let totalEarned = 0;
    let totalSpent = 0;

    for (const tx of transactions) {
      if (tx.toUserId === userId) {
        totalEarned += tx.amount;
      }
      if (tx.fromUserId === userId) {
        totalSpent += tx.amount;
      }
    }

    res.json({
      creditBalance: user.creditBalance,
      totalEarned,
      totalSpent,
      completedExchanges: user.profile?.completedCount || 0,
      transactions: transactions.map(tx => {
        let otherParty = 'Community System';
        if (tx.type === 'REDEEMED') {
          otherParty = 'Perk Partner Voucher';
        } else if (tx.type === 'DONATED_TO_POOL') {
          otherParty = 'Community Credit Pool';
        } else if (tx.type === 'ALLOCATED_FROM_POOL') {
          otherParty = 'Community Pool Grant';
        } else if (tx.toUserId === userId) {
          otherParty = tx.fromUser?.profile?.fullName || tx.fromUser?.email || 'Community System';
        } else if (tx.fromUserId === userId) {
          otherParty = tx.toUser?.profile?.fullName || tx.toUser?.email || 'Community System';
        }

        let serviceTitle = 'Direct Service Exchange';
        if (tx.booking?.listing?.title) {
          serviceTitle = tx.booking.listing.title;
        } else if (tx.type === 'REDEEMED') {
          serviceTitle = 'Perk Redemption';
        } else if (tx.type === 'DONATED_TO_POOL') {
          serviceTitle = 'Community Pool Donation';
        } else if (tx.type === 'ALLOCATED_FROM_POOL') {
          serviceTitle = 'Community Pool Allocation';
        } else if (tx.type === 'SIGNUP_BONUS') {
          serviceTitle = 'Welcome Gift';
        }

        return {
          id: tx.id,
          bookingId: tx.bookingId,
          serviceTitle,
          amount: tx.amount,
          baseCreditAmount: tx.baseCreditAmount,
          multiplier: tx.multiplier,
          finalCreditAmount: tx.finalCreditAmount,
          transactionReason: tx.transactionReason,
          type: tx.type,
          direction: tx.toUserId === userId ? 'INCOMING' : 'OUTGOING',
          otherParty,
          description: tx.description,
          createdAt: tx.createdAt
        };
      })
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
