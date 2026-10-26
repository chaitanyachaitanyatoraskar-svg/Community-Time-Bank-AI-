import { Router, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Submit review after completed booking
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const authorId = req.user!.id;
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating || !comment) {
      res.status(400).json({ error: 'Booking ID, rating (1-5), and comment are required.' });
      return;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (booking.status !== 'COMPLETED') {
      res.status(400).json({ error: 'Reviews can only be submitted for COMPLETED bookings.' });
      return;
    }

    if (booking.requesterId !== authorId && booking.helperId !== authorId) {
      res.status(403).json({ error: 'Only participants in this booking can leave a review.' });
      return;
    }

    const subjectId = booking.requesterId === authorId ? booking.helperId : booking.requesterId;

    if (authorId === subjectId) {
      res.status(400).json({ error: 'You cannot review yourself.' });
      return;
    }

    const existing = await prisma.review.findUnique({
      where: {
        bookingId_authorId: {
          bookingId,
          authorId
        }
      }
    });

    if (existing) {
      res.status(400).json({ error: 'You have already submitted a review for this booking.' });
      return;
    }

    // Save review
    const review = await prisma.review.create({
      data: {
        bookingId,
        authorId,
        subjectId,
        rating: Math.max(1, Math.min(5, Number(rating))),
        comment
      },
      include: {
        author: { select: { id: true, profile: { select: { fullName: true } } } }
      }
    });

    // Recalculate average rating for subject
    const subjectReviews = await prisma.review.findMany({
      where: { subjectId }
    });

    const avg = subjectReviews.reduce((sum, r) => sum + r.rating, 0) / subjectReviews.length;

    await prisma.profile.update({
      where: { userId: subjectId },
      data: {
        averageRating: Number(avg.toFixed(2)),
        reviewCount: subjectReviews.length
      }
    });

    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get reviews for a user
router.get('/user/:userId', async (req, res): Promise<void> => {
  try {
    const { userId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { subjectId: userId },
      include: {
        author: { select: { id: true, profile: { select: { fullName: true, area: true } } } },
        booking: { select: { listing: { select: { title: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
