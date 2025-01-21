import express, { Router } from 'express';
import prisma from '../../lib/prisma';
import { isAuthenticated } from '../../middleware/auth';
import { ActivityLog, Prisma, ActivityType } from '@prisma/client';

type ActivityWithIncludes = Prisma.ActivityLogGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        avatarColour: true;
      };
    };
    claim: {
      select: {
        claimNumber: true;
      };
    };
    items: {
      include: {
        item: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;

const router: Router = express.Router();

const MAX_LIMIT = 1000;

// Helper function to format activities
const formatActivities = (activities: ActivityWithIncludes[]) => {
  return activities.map((activity) => {
    const userName = [activity.user.firstName, activity.user.lastName]
      .filter(Boolean)
      .join(' ');

    // Format the action message based on activity type
    let action = '';
    switch (activity.activityType) {
      case 'CLAIM_CREATED':
        action = `Created claim ${activity.claim?.claimNumber}`;
        break;
      case 'CLAIM_UPDATED':
        action = `Updated claim ${activity.claim?.claimNumber}`;
        break;
      case 'CLAIM_STATUS_CHANGED':
        action = `Changed status of claim ${activity.claim?.claimNumber}`;
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
};

// Helper function to get common Prisma query options
const getQueryOptions = (limit: number) => ({
  take: Math.min(limit, MAX_LIMIT),
  orderBy: {
    createdAt: 'desc' as const,
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

// GET /api/activities
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'Invalid limit parameter' });
    }

    const activities = await prisma.activityLog.findMany(
      getQueryOptions(limit)
    );
    res.json(formatActivities(activities));
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// GET /api/activities/claim/:claimNumber
router.get('/claim/:claimNumber', isAuthenticated, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const claimNumber = req.params.claimNumber;

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'Invalid limit parameter' });
    }

    // First find the claim by claimNumber
    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      select: { id: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    const activities = await prisma.activityLog.findMany({
      ...getQueryOptions(limit),
      where: {
        claimId: claim.id,
      },
    });

    res.json(formatActivities(activities));
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

export default router;
