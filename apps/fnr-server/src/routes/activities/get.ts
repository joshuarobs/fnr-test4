import express, { Router } from 'express';
import prisma from '../../lib/prisma';
import { isAuthenticated } from '../../middleware/auth';
import { ActivityLog, Prisma, ActivityType } from '@prisma/client';

type ActivityWithIncludes = {
  id: number;
  activityType: ActivityType;
  userId: number;
  claimId: number;
  metadata: Prisma.JsonValue;
  createdAt: Date;
  user: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    avatarColour: string | null;
    staff?: {
      employeeId: string;
    } | null;
  };
  claim: {
    claimNumber: string;
  } | null;
  items: {
    id: number;
    metadata: Prisma.JsonValue;
    activityLogId: number;
    itemId: number;
    item: {
      name: string;
    };
  }[];
};

const router: Router = express.Router();

const MAX_LIMIT = 1000;

// Helper function to format activities
const formatActivities = (activities: ActivityWithIncludes[]) => {
  return activities.map((activity) => {
    const userName = [activity.user.firstName, activity.user.lastName]
      .filter(Boolean)
      .join(' ');

    return {
      id: activity.id,
      user: {
        id: activity.user.id,
        name: userName,
        firstName: activity.user.firstName,
        lastName: activity.user.lastName,
        avatar: '', // No avatar URLs, using avatarColour instead
        avatarColour: activity.user.avatarColour,
        employeeId: activity.user.staff?.employeeId,
      },
      activityType: activity.activityType,
      timestamp: activity.createdAt,
      metadata: {
        claimNumber: activity.claim?.claimNumber,
        itemName: activity.items[0]?.item.name,
        details: (activity.metadata as { details?: string })?.details,
      },
    };
  });
};

// Helper function to get common Prisma query options
const getQueryOptions = (limit: number) => ({
  take: Math.min(limit, MAX_LIMIT),
  orderBy: {
    createdAt: 'desc' as const,
  },
  select: {
    id: true,
    activityType: true,
    createdAt: true,
    metadata: true,
    userId: true,
    claimId: true,
    user: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarColour: true,
        staff: {
          select: {
            employeeId: true,
          },
        },
      },
    },
    claim: {
      select: {
        claimNumber: true,
      },
    },
    items: {
      select: {
        id: true,
        metadata: true,
        activityLogId: true,
        itemId: true,
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
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const claimNumber = req.params.claimNumber;

    if (isNaN(pageSize) || pageSize < 1 || isNaN(page) || page < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    // First find the claim by claimNumber
    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      select: { id: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Get total count for pagination
    const totalActivities = await prisma.activityLog.count({
      where: {
        claimId: claim.id,
      },
    });

    // Get paginated activities
    const activities = await prisma.activityLog.findMany({
      ...getQueryOptions(pageSize),
      where: {
        claimId: claim.id,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    res.json({
      activities: formatActivities(activities),
      total: totalActivities,
      page,
      pageSize,
      totalPages: Math.ceil(totalActivities / pageSize),
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

export default router;
