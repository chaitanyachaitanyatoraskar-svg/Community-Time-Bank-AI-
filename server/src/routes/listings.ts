import { Router, Request, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get public listings with optional filters
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, categoryId, area, search, status = 'ACTIVE' } = req.query;

    const listings = await prisma.listing.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(type ? { type: type as any } : {}),
        ...(categoryId ? { categoryId: categoryId as string } : {}),
        ...(area ? { area: { contains: area as string } } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search as string } },
                { description: { contains: search as string } }
              ]
            }
          : {})
      },
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            email: true,
            profile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(listings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get member's own listings
router.get('/my', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const listings = await prisma.listing.findMany({
      where: { ownerId: userId },
      include: {
        category: true,
        bookings: {
          select: {
            id: true,
            status: true,
            requesterId: true,
            helperId: true,
            startAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(listings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single listing details
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            profile: true,
            userSkills: { include: { skill: true } },
            availability: true
          }
        }
      }
    });

    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    res.json(listing);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new offer or request
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user!.id;
    const { 
      type, 
      categoryId, 
      title, 
      description, 
      durationHours = 1.0, 
      area, 
      preferredDates,
      complexityLevel = 'STANDARD',
      multiplier = 1.0,
      complexityExplanation,
      materialsRequired = false,
      urgencyLevel = 'STANDARD'
    } = req.body;

    if (!type || !categoryId || !title || !description) {
      res.status(400).json({ error: 'Type, category, title, and description are required.' });
      return;
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }

    const requestedMultiplier = Number(multiplier) || 1.0;
    const allowedMultipliers = [1.0, 1.25, 1.5];
    if (!allowedMultipliers.includes(requestedMultiplier)) {
      res.status(400).json({ error: 'Invalid multiplier. Allowed options are 1.0x, 1.25x, or 1.5x.' });
      return;
    }

    if (requestedMultiplier > 1.0 && !category.multiplierEligible) {
      res.status(400).json({ error: `Category "${category.name}" is not eligible for multiplier rates.` });
      return;
    }

    if (requestedMultiplier > category.maxMultiplier) {
      res.status(400).json({ error: `Requested multiplier (${requestedMultiplier}x) exceeds maximum allowed for this category (${category.maxMultiplier}x).` });
      return;
    }

    const listing = await prisma.listing.create({
      data: {
        ownerId,
        type: type === 'OFFER' ? 'OFFER' : 'REQUEST',
        categoryId,
        title,
        description,
        durationHours: Number(durationHours) || 1.0,
        area: area || 'Downtown',
        preferredDates: preferredDates || 'Flexible',
        complexityLevel: ['STANDARD', 'INTERMEDIATE', 'ADVANCED'].includes(complexityLevel) ? complexityLevel : 'STANDARD',
        multiplier: requestedMultiplier,
        complexityExplanation: complexityExplanation || null,
        materialsRequired: Boolean(materialsRequired),
        urgencyLevel: urgencyLevel || 'STANDARD',
        status: 'ACTIVE'
      },
      include: { category: true, owner: { select: { id: true, profile: true } } }
    });

    res.status(201).json(listing);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update listing (ownership guard)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const { 
      title, 
      description, 
      durationHours, 
      status, 
      area, 
      preferredDates, 
      categoryId,
      complexityLevel,
      multiplier,
      complexityExplanation,
      materialsRequired,
      urgencyLevel
    } = req.body;

    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    if (existing.ownerId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Only listing owner can modify this listing' });
      return;
    }

    if (multiplier !== undefined) {
      const numMultiplier = Number(multiplier);
      if (![1.0, 1.25, 1.5].includes(numMultiplier)) {
        res.status(400).json({ error: 'Invalid multiplier. Allowed options are 1.0x, 1.25x, or 1.5x.' });
        return;
      }
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(durationHours ? { durationHours: Number(durationHours) } : {}),
        ...(status ? { status } : {}),
        ...(area ? { area } : {}),
        ...(preferredDates ? { preferredDates } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(complexityLevel ? { complexityLevel } : {}),
        ...(multiplier !== undefined ? { multiplier: Number(multiplier) } : {}),
        ...(complexityExplanation !== undefined ? { complexityExplanation } : {}),
        ...(materialsRequired !== undefined ? { materialsRequired: Boolean(materialsRequired) } : {}),
        ...(urgencyLevel ? { urgencyLevel } : {})
      },
      include: { category: true }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete or close listing
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    if (existing.ownerId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Unauthorized to delete this listing' });
      return;
    }

    await prisma.listing.delete({ where: { id } });
    res.json({ message: 'Listing deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
