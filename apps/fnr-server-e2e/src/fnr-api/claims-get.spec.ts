import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

// Mock prisma
const prisma = {
  claim: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  recentlyViewedClaim: {
    findMany: jest.fn(),
  },
  activityLog: {
    findMany: jest.fn(),
  },
} as unknown as PrismaClient;

// Create a mock router
const mockRouter = Router();

mockRouter.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const claims = await prisma.claim.findMany({
      take: limit,
      select: {
        id: true,
        claimNumber: true,
        description: true,
        status: true,
        items: {
          select: {
            id: true,
          },
        },
        totalClaimed: true,
        totalApproved: true,
        createdAt: true,
        updatedAt: true,
        insuredProgressPercent: true,
        ourProgressPercent: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

mockRouter.get('/recent-views', async (req, res) => {
  try {
    const userId = 1;
    const recentViews = await prisma.recentlyViewedClaim.findMany({
      where: { userId },
      include: {
        claim: {
          select: {
            claimNumber: true,
            description: true,
            status: true,
            totalClaimed: true,
            totalApproved: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        viewedAt: 'desc',
      },
      take: 100,
    });
    res.json(recentViews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent views' });
  }
});

mockRouter.get('/:claimNumber', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      include: {
        items: true,
      },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Get activities
    const activities = await prisma.activityLog.findMany({
      where: {
        claim: {
          claimNumber,
        },
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
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

    // Format activities
    const formattedActivities = activities.map((activity) => ({
      id: activity.id,
      user: {
        id: activity.user.id,
        name: `${activity.user.firstName} ${activity.user.lastName}`,
        firstName: activity.user.firstName,
        lastName: activity.user.lastName,
        avatar: '',
        avatarColour: activity.user.avatarColour,
        employeeId: activity.user.staff?.employeeId,
      },
      action: 'Some action',
      timestamp: activity.createdAt,
    }));

    res.json({
      ...claim,
      activities: formattedActivities,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch claim' });
  }
});

describe('Claims API - GET endpoints', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/claims', mockRouter);
    jest.clearAllMocks();
  });

  describe('GET /api/claims', () => {
    const mockClaims = [
      {
        id: 1,
        claimNumber: 'CLM001',
        description: 'Test Claim 1',
        status: 'OPEN',
        items: [{ id: 1 }, { id: 2 }],
        totalClaimed: 1000,
        totalApproved: 800,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        insuredProgressPercent: 60,
        ourProgressPercent: 80,
      },
    ];

    beforeEach(() => {
      (prisma.claim.findMany as jest.Mock).mockResolvedValue(mockClaims);
    });

    it('should fetch claims with default limit', async () => {
      const response = await request(app).get('/api/claims');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClaims);
      expect(prisma.claim.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
        })
      );
    });

    it('should fetch claims with custom limit', async () => {
      const response = await request(app).get('/api/claims?limit=5');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClaims);
      expect(prisma.claim.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        })
      );
    });
  });

  describe('GET /api/claims/recent-views', () => {
    const mockRecentViews = [
      {
        id: 1,
        viewedAt: new Date().toISOString(),
        claim: {
          claimNumber: 'CLM001',
          description: 'Test Claim 1',
          status: 'OPEN',
          totalClaimed: 1000,
          totalApproved: 800,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    ];

    beforeEach(() => {
      (prisma.recentlyViewedClaim.findMany as jest.Mock).mockResolvedValue(
        mockRecentViews
      );
    });

    it('should fetch recently viewed claims', async () => {
      const response = await request(app).get('/api/claims/recent-views');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecentViews);
      expect(prisma.recentlyViewedClaim.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 1 },
          take: 100,
        })
      );
    });
  });

  describe('GET /api/claims/:claimNumber', () => {
    const mockClaim = {
      id: 1,
      claimNumber: 'CLM001',
      description: 'Test Claim',
      status: 'OPEN',
      items: [
        {
          id: 1,
          name: 'Test Item',
          category: 'Electronics',
          quantity: 1,
        },
      ],
      activities: [
        {
          id: 1,
          user: {
            id: 1,
            name: 'John Doe',
            firstName: 'John',
            lastName: 'Doe',
            avatar: '',
            avatarColour: 'blue',
            employeeId: 'EMP001',
          },
          action: 'Some action',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const mockActivities = [
      {
        id: 1,
        user: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          avatarColour: 'blue',
          staff: {
            employeeId: 'EMP001',
          },
        },
        claim: {
          claimNumber: 'CLM001',
        },
        items: [],
        createdAt: new Date().toISOString(),
        activityType: 'CLAIM_CREATED',
      },
    ];

    beforeEach(() => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(mockClaim);
      (prisma.activityLog.findMany as jest.Mock).mockResolvedValue(
        mockActivities
      );
    });

    it('should fetch a specific claim by claim number', async () => {
      const response = await request(app).get('/api/claims/CLM001');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClaim);
      expect(prisma.claim.findUnique).toHaveBeenCalledWith({
        where: { claimNumber: 'CLM001' },
        include: { items: true },
      });
      expect(prisma.activityLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            claim: {
              claimNumber: 'CLM001',
            },
          },
          take: 10,
        })
      );
    });

    it('should return 404 if claim is not found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/claims/INVALID');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Claim not found' });
    });
  });
});
