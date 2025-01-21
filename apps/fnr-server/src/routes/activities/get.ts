import express, { Router } from 'express';
import prisma from '../../lib/prisma';
import { isAuthenticated } from '../../middleware/auth';

const router: Router = express.Router();

// GET /api/activities
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const activities = await prisma.activityLog.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarColour: true,
          },
        },
        claim: {
          select: {
            claimNumber: true,
          },
        },
        items: {
          include: {
            item: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Transform the data to match the frontend Activity interface
    const formattedActivities = activities.map((activity) => {
      const userName = [activity.user.firstName, activity.user.lastName]
        .filter(Boolean)
        .join(' ');

      // Format the action message based on activity type
      let action = '';
      switch (activity.activityType) {
        case 'CLAIM_CREATED':
          action = `Created claim ${activity.claim.claimNumber}`;
          break;
        case 'CLAIM_UPDATED':
          action = `Updated claim ${activity.claim.claimNumber}`;
          break;
        case 'CLAIM_STATUS_CHANGED':
          action = `Changed status of claim ${activity.claim.claimNumber}`;
          break;
        case 'ITEM_CREATED':
          if (activity.items[0]) {
            action = `Added new item "${activity.items[0].item.name}"`;
          }
          break;
        case 'ITEM_UPDATED':
          if (activity.items[0]) {
            action = `Updated item "${activity.items[0].item.name}"`;
          }
          break;
        case 'ITEM_EVIDENCE_ADDED':
          if (activity.items[0]) {
            action = `Added evidence to "${activity.items[0].item.name}"`;
          }
          break;
        default:
          action = activity.activityType.toLowerCase().replace(/_/g, ' ');
      }

      // Add metadata details if available
      if (activity.metadata) {
        const meta = activity.metadata as Record<string, any>;
        if (meta.details) {
          action += ` - ${meta.details}`;
        }
      }

      return {
        id: activity.id,
        user: {
          name: userName,
          avatar: '', // No avatar URLs, using avatarColour instead
          avatarColour: activity.user.avatarColour,
        },
        action,
        timestamp: activity.createdAt,
      };
    });

    res.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

export default router;
