import { Router, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Ensure the default community pool singleton exists
async function getOrCreateDefaultPool() {
  let pool = await prisma.communityPool.findUnique({
    where: { id: 'default-pool' }
  });

  if (!pool) {
    pool = await prisma.communityPool.create({
      data: {
        id: 'default-pool',
        name: 'Campus Community Care Pool',
        description: 'Shared credit reserve funded by member donations to provide welcome grants and hardship assistance.',
        currentBalance: 0.0,
        totalDonated: 0.0,
        totalAllocated: 0.0
      }
    });
  }

  return pool;
}

// 1. Get Community Pool metrics, recent donations, and allocation history
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pool = await getOrCreateDefaultPool();

    const [donations, allocations, uniqueDonors, uniqueRecipients] = await Promise.all([
      prisma.communityPoolDonation.findMany({
        where: { poolId: pool.id },
        include: {
          donor: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  fullName: true,
                  avatarUrl: true,
                  area: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 30
      }),
      prisma.communityPoolAllocation.findMany({
        where: { poolId: pool.id },
        include: {
          recipient: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  fullName: true,
                  avatarUrl: true,
                  area: true
                }
              }
            }
          },
          admin: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  fullName: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 30
      }),
      prisma.communityPoolDonation.groupBy({
        by: ['donorId'],
        where: { poolId: pool.id }
      }),
      prisma.communityPoolAllocation.groupBy({
        by: ['recipientId'],
        where: { poolId: pool.id }
      })
    ]);

    res.json({
      id: pool.id,
      name: pool.name,
      description: pool.description,
      currentBalance: pool.currentBalance,
      totalDonated: pool.totalDonated,
      totalAllocated: pool.totalAllocated,
      donorCount: uniqueDonors.length,
      recipientCount: uniqueRecipients.length,
      recentDonations: donations.map(d => ({
        id: d.id,
        poolId: d.poolId,
        userId: d.donorId,
        amount: d.amount,
        note: d.note,
        createdAt: d.createdAt,
        user: {
          id: d.donor.id,
          email: d.donor.email,
          profile: d.donor.profile
        }
      })),
      recentAllocations: allocations.map(a => ({
        id: a.id,
        poolId: a.poolId,
        recipientId: a.recipientId,
        adminId: a.adminId,
        amount: a.amount,
        reason: a.reason,
        createdAt: a.createdAt,
        recipient: {
          id: a.recipient.id,
          email: a.recipient.email,
          profile: a.recipient.profile
        },
        admin: {
          id: a.admin.id,
          email: a.admin.email,
          profile: a.admin.profile
        }
      }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Member: Donate surplus time credits to the Community Pool
router.post('/donate', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { amount, note } = req.body;

    const donateAmount = parseFloat(amount);
    if (isNaN(donateAmount) || donateAmount <= 0) {
      res.status(400).json({ error: 'Please enter a valid positive credit amount to donate.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.creditBalance < donateAmount) {
      res.status(400).json({
        error: `Insufficient available credits. Your current balance is ${user.creditBalance.toFixed(1)} credits, but you requested to donate ${donateAmount.toFixed(1)} credits.`
      });
      return;
    }

    const pool = await getOrCreateDefaultPool();

    // Execute atomic donation transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct from donor's balance
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          creditBalance: { decrement: donateAmount }
        }
      });

      // 2. Increment pool balance and totalDonated
      const updatedPool = await tx.communityPool.update({
        where: { id: pool.id },
        data: {
          currentBalance: { increment: donateAmount },
          totalDonated: { increment: donateAmount }
        }
      });

      // 3. Create pool donation record
      const donation = await tx.communityPoolDonation.create({
        data: {
          poolId: pool.id,
          donorId: userId,
          amount: donateAmount,
          note: note?.trim() || null
        }
      });

      // 4. Create immutable credit ledger entry
      const transaction = await tx.creditTransaction.create({
        data: {
          fromUserId: userId,
          toUserId: null,
          amount: donateAmount,
          type: 'DONATED_TO_POOL',
          description: `Donated ${donateAmount.toFixed(1)} credits to ${pool.name}${note ? `: "${note.trim()}"` : ''}`
        }
      });

      return { updatedUser, updatedPool, donation, transaction };
    });

    res.status(201).json({
      message: `Thank you for your generosity! You donated ${donateAmount.toFixed(1)} credits to the Community Pool.`,
      donation: result.donation,
      newBalance: result.updatedUser.creditBalance,
      poolBalance: result.updatedPool.currentBalance
    });
  } catch (error: any) {
    console.error('Pool donation error:', error);
    res.status(500).json({ error: error.message || 'Donation failed' });
  }
});

// 3. Admin: Allocate credits from pool to a member needing initial support
router.post('/allocate', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const adminId = req.user!.id;
    const { recipientId, amount, reason } = req.body;

    const allocAmount = parseFloat(amount);
    if (isNaN(allocAmount) || allocAmount <= 0) {
      res.status(400).json({ error: 'Please provide a valid positive allocation amount.' });
      return;
    }

    if (!recipientId || !reason || !reason.trim()) {
      res.status(400).json({ error: 'Recipient member and an explicit allocation reason are required for audit traceability.' });
      return;
    }

    const pool = await getOrCreateDefaultPool();

    if (pool.currentBalance < allocAmount) {
      res.status(400).json({
        error: `Insufficient pool reserves. The community pool currently has ${pool.currentBalance.toFixed(1)} credits available, but you requested to allocate ${allocAmount.toFixed(1)} credits.`
      });
      return;
    }

    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      include: { profile: true }
    });

    if (!recipient) {
      res.status(404).json({ error: 'Recipient member not found.' });
      return;
    }

    // Execute atomic allocation transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Decrement pool balance and increment totalAllocated
      const updatedPool = await tx.communityPool.update({
        where: { id: pool.id },
        data: {
          currentBalance: { decrement: allocAmount },
          totalAllocated: { increment: allocAmount }
        }
      });

      // 2. Increment recipient balance
      const updatedRecipient = await tx.user.update({
        where: { id: recipientId },
        data: {
          creditBalance: { increment: allocAmount }
        }
      });

      // 3. Create pool allocation record with admin audit trail
      const allocation = await tx.communityPoolAllocation.create({
        data: {
          poolId: pool.id,
          recipientId,
          adminId,
          amount: allocAmount,
          reason: reason.trim()
        }
      });

      // 4. Create immutable credit ledger entry
      const transaction = await tx.creditTransaction.create({
        data: {
          fromUserId: adminId,
          toUserId: recipientId,
          amount: allocAmount,
          type: 'ALLOCATED_FROM_POOL',
          description: `Community Pool Grant: ${reason.trim()}`
        }
      });

      return { updatedPool, updatedRecipient, allocation, transaction };
    });

    res.status(201).json({
      message: `Successfully allocated ${allocAmount.toFixed(1)} credits from Community Pool to ${recipient.profile?.fullName || recipient.email}.`,
      allocation: result.allocation,
      poolBalance: result.updatedPool.currentBalance,
      recipientBalance: result.updatedRecipient.creditBalance
    });
  } catch (error: any) {
    console.error('Pool allocation error:', error);
    res.status(500).json({ error: error.message || 'Pool allocation failed' });
  }
});

export default router;
