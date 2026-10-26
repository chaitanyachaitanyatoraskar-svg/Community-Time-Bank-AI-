import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import categoriesRoutes from './routes/categories.js';
import listingsRoutes from './routes/listings.js';
import matchingRoutes from './routes/matching.js';
import bookingsRoutes from './routes/bookings.js';
import walletRoutes from './routes/wallet.js';
import reviewsRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';
import aiAssistantRoutes from './routes/aiAssistant.js';
import redemptionsRoutes from './routes/redemptions.js';
import communityPoolRoutes from './routes/communityPool.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai-assistant', aiAssistantRoutes);
app.use('/api/redemptions', redemptionsRoutes);
app.use('/api/community-pool', communityPoolRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'Community Time Bank AI API', timestamp: new Date() });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Community Time Bank AI Server running on http://localhost:${PORT}`);
});
