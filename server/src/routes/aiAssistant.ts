import { Router, Request, Response } from 'express';
import prisma from '../prisma.js';
import { calculateMatches } from '../services/matchingService.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/chat', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    const userId = req.user?.id;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const lower = message.toLowerCase();

    // 1. Check if user is asking for helper recommendations
    const isRecommendationQuery = lower.includes('recommend') || lower.includes('find') || lower.includes('helper') || lower.includes('who can help') || lower.includes('python') || lower.includes('math') || lower.includes('garden') || lower.includes('computer') || lower.includes('design');

    if (isRecommendationQuery) {
      const matches = await calculateMatches({
        title: message,
        description: message,
        excludeUserId: userId
      });

      if (matches.length > 0) {
        const top = matches.slice(0, 3);
        const helpersSummary = top.map(h => `• **${h.helperName}** (${h.matchScore}% Match): ${h.explanation} • Skills: ${h.skills.map(s => s.name).join(', ')}`).join('\n');

        res.json({
          reply: `I analyzed our community network and found ${top.length} great helper recommendations for you:\n\n${helpersSummary}\n\nWould you like me to help you schedule a 1-on-1 session with any of them?`,
          recommendations: top,
          type: 'RECOMMENDATION'
        });
        return;
      }
    }

    // 2. Questions about Time Credits & Balances
    if (lower.includes('credit') || lower.includes('how does it work') || lower.includes('earn') || lower.includes('spend')) {
      res.json({
        reply: `**How Time Credits Work on TimeBank AI:**\n\n1. **Equality Principal**: 1 hour of verified service = **1 Time Credit**, regardless of the skill.\n2. **Earn Credits**: Offer your skills (programming, tutoring, plant care, language practice) and complete verified sessions.\n3. **Spend Credits**: Use your credits to request help from neighbors.\n4. **Welcome Gift**: Every new member receives **3 free time credits** upon account registration!`,
        type: 'INFO'
      });
      return;
    }

    // 3. Questions about Double Confirmation & Completion
    if (lower.includes('confirm') || lower.includes('completion') || lower.includes('double') || lower.includes('safety') || lower.includes('dispute')) {
      res.json({
        reply: `**Double-Party Completion & Safety Protocol:**\n\n• After your scheduled session is finished, both you and your exchange partner click **"Confirm Service Completion"** in your Bookings tab.\n• Once **both parties confirm**, the credit transfers atomically to the helper's wallet.\n• If there is an issue or a no-show, you can click **"Report Issue / Dispute"** to notify our Campus Administrator desk for mediation.`,
        type: 'INFO'
      });
      return;
    }

    // 4. Questions about community workshops or events
    if (lower.includes('event') || lower.includes('workshop') || lower.includes('group')) {
      res.json({
        reply: `We have several active group workshops in our community:\n\n• **Digital Skills for All**: Laptop & internet productivity (Apr 20)\n• **English Conversation Circle**: Casual language cafe (Apr 25)\n• **Community Garden & Balcony Clean-Up**: Herb planting & pruning (May 3)\n\nYou can view and join all of them in the **Community** tab in the sidebar!`,
        type: 'INFO'
      });
      return;
    }

    // 5. Default intelligent assistant reply
    res.json({
      reply: `Hello! I'm your **TimeBank AI Assistant**. I can help you with:\n\n1. Finding and matching skilled helpers for any subject (Python, Excel, Gardening, Language, etc.)\n2. Explaining how to earn and spend time credits\n3. Checking active community events and workshops\n4. Guiding you through the booking and completion confirmation process.\n\nWhat would you like assistance with today?`,
      type: 'GENERAL'
    });

  } catch (error: any) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
