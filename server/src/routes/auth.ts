import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'community-timebank-jwt-secret-key-super-secure';

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, area, phone, contactPreference } = req.body;

    if (!email || !password || !fullName) {
      res.status(400).json({ error: 'Email, password, and full name are required.' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'MEMBER',
        creditBalance: 3.0, // Welcome gift of 3 time credits
        profile: {
          create: {
            fullName,
            area: area || 'Downtown',
            phone: phone || null,
            contactPreference: contactPreference || 'IN_APP',
            averageRating: 5.0,
            reviewCount: 0,
            completedCount: 0
          }
        }
      },
      include: { profile: true }
    });

    // Record welcome credit bonus in transaction history
    await prisma.creditTransaction.create({
      data: {
        toUserId: user.id,
        amount: 3.0,
        type: 'SIGNUP_BONUS',
        description: 'Welcome Bonus: 3 initial time credits to kickstart community exchange!'
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        creditBalance: user.creditBalance,
        profile: user.profile
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    if (user.status === 'SUSPENDED') {
      res.status(403).json({ error: 'Your account has been suspended by an administrator.' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        creditBalance: user.creditBalance,
        profile: user.profile
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// Quick Demo Login Switcher (convenient for college evaluation & testing)
router.post('/demo-login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { role = 'member-a' } = req.body; // 'member-a', 'member-b', 'admin'
    let email = 'member.a@college.edu';
    if (role === 'member-b') email = 'member.b@college.edu';
    if (role === 'admin') email = 'admin@college.edu';

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      res.status(404).json({ error: `Demo account ${email} not found. Please run seed script.` });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        creditBalance: user.creditBalance,
        profile: user.profile
      }
    });
  } catch (error: any) {
    console.error('Demo login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Current User Profile & Balance
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        userSkills: {
          include: {
            skill: { include: { category: true } }
          }
        },
        availability: true
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      creditBalance: user.creditBalance,
      profile: user.profile,
      userSkills: user.userSkills,
      availability: user.availability
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
