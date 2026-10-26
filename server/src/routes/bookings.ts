import { Router, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { submitCompletionConfirmation } from '../services/ledgerService.js';

const router = Router();

// Get member's bookings (both as requester and helper)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { helperId: userId }
        ]
      },
      include: {
        listing: { include: { category: true } },
        requester: {
          select: {
            id: true,
            email: true,
            profile: true
          }
        },
        helper: {
          select: {
            id: true,
            email: true,
            profile: true
          }
        },
        confirmations: true,
        reviews: true,
        transactions: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Apply privacy masking: hide phone/email if status is not ACCEPTED or COMPLETED
    const sanitized = bookings.map(b => {
      const isAcceptedOrDone = b.status === 'ACCEPTED' || b.status === 'COMPLETED';
      return {
        ...b,
        requester: {
          ...b.requester,
          email: isAcceptedOrDone ? b.requester.email : '***@masked.com',
          profile: b.requester.profile ? {
            ...b.requester.profile,
            phone: isAcceptedOrDone ? b.requester.profile.phone : null
          } : null
        },
        helper: {
          ...b.helper,
          email: isAcceptedOrDone ? b.helper.email : '***@masked.com',
          profile: b.helper.profile ? {
            ...b.helper.profile,
            phone: isAcceptedOrDone ? b.helper.profile.phone : null
          } : null
        }
      };
    });

    res.json(sanitized);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single booking detail
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        listing: { include: { category: true } },
        requester: { select: { id: true, email: true, profile: true } },
        helper: { select: { id: true, email: true, profile: true } },
        confirmations: true,
        reviews: true,
        transactions: true
      }
    });

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (booking.requesterId !== userId && booking.helperId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Unauthorized to view this booking' });
      return;
    }

    const isAcceptedOrDone = booking.status === 'ACCEPTED' || booking.status === 'COMPLETED';
    const sanitized = {
      ...booking,
      requester: {
        ...booking.requester,
        email: isAcceptedOrDone ? booking.requester.email : '***@masked.com',
        profile: booking.requester.profile ? {
          ...booking.requester.profile,
          phone: isAcceptedOrDone ? booking.requester.profile.phone : null
        } : null
      },
      helper: {
        ...booking.helper,
        email: isAcceptedOrDone ? booking.helper.email : '***@masked.com',
        profile: booking.helper.profile ? {
          ...booking.helper.profile,
          phone: isAcceptedOrDone ? booking.helper.profile.phone : null
        } : null
      }
    };

    res.json(sanitized);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new booking request
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const { helperId, listingId, startAt, durationHours = 1.0, notes } = req.body;

    if (!helperId) {
      res.status(400).json({ error: 'Helper ID is required.' });
      return;
    }

    if (helperId === requesterId) {
      res.status(400).json({ error: 'You cannot book a service with yourself.' });
      return;
    }

    const helper = await prisma.user.findUnique({
      where: { id: helperId },
      include: { profile: true }
    });

    if (!helper || helper.status !== 'ACTIVE') {
      res.status(400).json({ error: 'Selected helper is currently inactive or not found.' });
      return;
    }

    let listing = null;
    if (listingId) {
      listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: { category: true }
      });
    }

    const duration = Number(durationHours) || 1.0;
    let multiplier = 1.0;

    if (req.body.agreedMultiplier !== undefined) {
      multiplier = Number(req.body.agreedMultiplier);
    } else if (listing?.multiplier) {
      multiplier = listing.multiplier;
    }

    if (![1.0, 1.25, 1.5].includes(multiplier)) {
      res.status(400).json({ error: 'Invalid multiplier rate. Allowed rates are 1.0x, 1.25x, or 1.5x.' });
      return;
    }

    if (listing?.category && multiplier > 1.0 && !listing.category.multiplierEligible) {
      res.status(400).json({ error: `Category "${listing.category.name}" is not eligible for multiplier rates.` });
      return;
    }

    const finalCreditAmount = duration * multiplier;

    const booking = await prisma.booking.create({
      data: {
        requesterId,
        helperId,
        listingId: listingId || null,
        startAt: startAt ? new Date(startAt) : new Date(Date.now() + 86400000), // Default tomorrow
        durationHours: duration,
        agreedMultiplier: multiplier,
        finalCreditAmount: finalCreditAmount,
        notes: notes || '',
        status: 'REQUESTED'
      },
      include: {
        listing: { include: { category: true } },
        requester: { select: { id: true, profile: true } },
        helper: { select: { id: true, profile: true } }
      }
    });

    res.status(201).json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Accept a booking request (Helper action)
router.patch('/:id/accept', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (booking.helperId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Only the requested helper can accept this booking.' });
      return;
    }

    if (booking.status !== 'REQUESTED') {
      res.status(400).json({ error: `Cannot accept booking in ${booking.status} status.` });
      return;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'ACCEPTED' },
      include: {
        listing: true,
        requester: { select: { id: true, email: true, profile: true } },
        helper: { select: { id: true, email: true, profile: true } }
      }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel a booking
router.patch('/:id/cancel', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (booking.requesterId !== userId && booking.helperId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Only participants can cancel this booking.' });
      return;
    }

    if (booking.status === 'COMPLETED') {
      res.status(400).json({ error: 'Cannot cancel a completed booking.' });
      return;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm completion (Triggers double-confirmation ledger check)
router.post('/:id/confirm', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const result = await submitCompletionConfirmation(id, userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Dispute booking
router.post('/:id/dispute', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const { reason } = req.body;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (booking.requesterId !== userId && booking.helperId !== userId) {
      res.status(403).json({ error: 'Only participants can dispute this booking.' });
      return;
    }

    const targetUserId = booking.requesterId === userId ? booking.helperId : booking.requesterId;

    // Create report & update booking status
    const [report, updatedBooking] = await prisma.$transaction([
      prisma.report.create({
        data: {
          reporterId: userId,
          targetUserId,
          bookingId: id,
          reason: reason || 'Service delivery or completion dispute',
          status: 'OPEN'
        }
      }),
      prisma.booking.update({
        where: { id },
        data: { status: 'DISPUTED' }
      })
    ]);

    res.json({ message: 'Dispute submitted for administrator review', report, booking: updatedBooking });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
