import { Router, Request, Response } from 'express';
import { findMatchesForListing, calculateMatches } from '../services/matchingService.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Match helpers for an existing listing
router.get('/listing/:listingId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listingId = req.params.listingId as string;
    const userId = req.user?.id;

    const matches = await findMatchesForListing(listingId, userId);
    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Live dynamic match preview (for draft requests or interactive search)
router.post('/preview', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { categoryId, categoryName, title, description, area, preferredDates } = req.body;
    const userId = req.user?.id;

    const matches = await calculateMatches({
      categoryId,
      categoryName,
      title,
      description,
      area,
      preferredDates,
      excludeUserId: userId
    });

    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
