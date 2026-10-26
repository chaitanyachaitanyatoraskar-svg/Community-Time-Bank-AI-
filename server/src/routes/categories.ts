import { Router, Request, Response } from 'express';
import prisma from '../prisma.js';

const router = Router();

// Get all active categories and their skills
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      include: { skills: true },
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all skills directly
router.get('/skills', async (req: Request, res: Response): Promise<void> => {
  try {
    const skills = await prisma.skill.findMany({
      include: { category: true },
      orderBy: { name: 'asc' }
    });
    res.json(skills);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
