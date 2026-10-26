import { Router, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Update public profile details
router.put('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { fullName, bio, area, phone, contactPreference, avatarUrl } = req.body;

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        ...(fullName ? { fullName } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(area ? { area } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(contactPreference ? { contactPreference } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {})
      },
      create: {
        userId,
        fullName: fullName || 'Community Member',
        bio: bio || '',
        area: area || 'Downtown',
        phone: phone || null,
        avatarUrl: avatarUrl || null,
        contactPreference: contactPreference || 'IN_APP'
      }
    });

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user skills
router.post('/skills', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { skills } = req.body; // array of { skillId: string, proficiency: string }

    if (!Array.isArray(skills)) {
      res.status(400).json({ error: 'Skills must be an array' });
      return;
    }

    // Replace user skills
    await prisma.userSkill.deleteMany({ where: { userId } });

    if (skills.length > 0) {
      await prisma.userSkill.createMany({
        data: skills.map((s: { skillId: string; proficiency?: string }) => ({
          userId,
          skillId: s.skillId,
          proficiency: s.proficiency || 'INTERMEDIATE'
        }))
      });
    }

    const updated = await prisma.userSkill.findMany({
      where: { userId },
      include: { skill: { include: { category: true } } }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update availability slots
router.post('/availability', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { availability } = req.body; // array of { weekday: string, startTime: string, endTime: string }

    if (!Array.isArray(availability)) {
      res.status(400).json({ error: 'Availability must be an array' });
      return;
    }

    // Replace availability
    await prisma.availability.deleteMany({ where: { userId } });

    if (availability.length > 0) {
      await prisma.availability.createMany({
        data: availability.map((a: { weekday: string; startTime: string; endTime: string }) => ({
          userId,
          weekday: a.weekday,
          startTime: a.startTime,
          endTime: a.endTime
        }))
      });
    }

    const updated = await prisma.availability.findMany({
      where: { userId }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Public profile view
router.get('/:userId', async (req, res): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        createdAt: true,
        profile: true,
        userSkills: {
          include: {
            skill: { include: { category: true } }
          }
        },
        availability: true,
        receivedReviews: {
          include: {
            author: { select: { id: true, profile: { select: { fullName: true } } } }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!user) {
      res.status(404).json({ error: 'Member profile not found' });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
