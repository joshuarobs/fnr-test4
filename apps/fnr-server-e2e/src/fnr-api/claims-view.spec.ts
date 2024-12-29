import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

// Mock prisma
const prisma = {
  claim: {
    findUnique: jest.fn(),
  },
  recentlyViewedClaim: {
    count: jest.fn(),
    findMany: jest.fn(),
    updateMany: jest.fn(),
    upsert: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(prisma)),
} as unknown as PrismaClient;

// Create a mock router
const mockRouter = Router();

mockRouter.post('/:claimNumber/view', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const userId = 1;

    await prisma.$transaction(async (tx) => {
      const claim = await tx.claim.findUnique({
        where: { claimNumber },
        select: { id: true },
      });

      if (!claim) {
        throw new Error('Claim not found');
      }

      // Get current count of user's recently viewed claims
      const viewCount = await tx.recentlyViewedClaim.count({
        where: {
          userId,
          isDeleted: false,
        },
      });

      // If at or above limit, delete oldest view(s)
      if (viewCount >= 50) {
        const oldestViews = await tx.recentlyViewedClaim.findMany({
          where: {
            userId,
            isDeleted: false,
          },
          orderBy: {
            viewedAt: 'asc',
          },
          take: viewCount - 49,
        });

        if (oldestViews.length > 0) {
          await tx.recentlyViewedClaim.updateMany({
            where: {
              id: {
                in: oldestViews.map((view) => view.id),
              },
            },
            data: {
              isDeleted: true,
              deletedAt: new Date(),
            },
          });
        }
      }

      await tx.recentlyViewedClaim.upsert({
        where: {
          userId_claimId: {
            userId,
            claimId: claim.id,
          },
        },
        update: {
          viewedAt: new Date(),
          isDeleted: false,
          deletedAt: null,
        },
        create: {
          userId,
          claimId: claim.id,
        },
      });
    });

    res.json({ success: true });
  } catch (error) {
    if (error.message === 'Claim not found') {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.status(500).json({ error: 'Failed to record claim view' });
  }
});

describe('Claims API - View endpoint', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/claims', mockRouter);
    jest.clearAllMocks();
  });

  describe('POST /api/claims/:claimNumber/view', () => {
    const mockClaim = {
      id: 1,
      claimNumber: 'CLM001',
    };

    const mockRecentView = {
      id: 1,
      userId: 1,
      claimId: 1,
      viewedAt: new Date(),
    };

    beforeEach(() => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(mockClaim);
      (prisma.recentlyViewedClaim.upsert as jest.Mock).mockResolvedValue(
        mockRecentView
      );
    });

    it('should record a view when under the limit', async () => {
      // Mock count to return under limit
      (prisma.recentlyViewedClaim.count as jest.Mock).mockResolvedValue(49);

      const response = await request(app).post('/api/claims/CLM001/view');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(prisma.recentlyViewedClaim.count).toHaveBeenCalledWith({
        where: {
          userId: 1,
          isDeleted: false,
        },
      });
      expect(prisma.recentlyViewedClaim.findMany).not.toHaveBeenCalled();
      expect(prisma.recentlyViewedClaim.updateMany).not.toHaveBeenCalled();
      expect(prisma.recentlyViewedClaim.upsert).toHaveBeenCalled();
    });

    it('should soft delete oldest view when at limit', async () => {
      // Mock count to return at limit
      (prisma.recentlyViewedClaim.count as jest.Mock).mockResolvedValue(50);

      // Mock oldest view
      const oldestView = {
        id: 2,
        userId: 1,
        claimId: 2,
        viewedAt: new Date('2023-01-01'),
      };
      (prisma.recentlyViewedClaim.findMany as jest.Mock).mockResolvedValue([
        oldestView,
      ]);

      const response = await request(app).post('/api/claims/CLM001/view');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(prisma.recentlyViewedClaim.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          isDeleted: false,
        },
        orderBy: {
          viewedAt: 'asc',
        },
        take: 1,
      });
      expect(prisma.recentlyViewedClaim.updateMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: [oldestView.id],
          },
        },
        data: expect.objectContaining({
          isDeleted: true,
          deletedAt: expect.any(Date),
        }),
      });
    });

    it('should handle multiple deletions when over limit', async () => {
      // Mock count to return over limit
      (prisma.recentlyViewedClaim.count as jest.Mock).mockResolvedValue(52);

      // Mock oldest views
      const oldestViews = [
        {
          id: 2,
          userId: 1,
          claimId: 2,
          viewedAt: new Date('2023-01-01'),
        },
        {
          id: 3,
          userId: 1,
          claimId: 3,
          viewedAt: new Date('2023-01-02'),
        },
        {
          id: 4,
          userId: 1,
          claimId: 4,
          viewedAt: new Date('2023-01-03'),
        },
      ];
      (prisma.recentlyViewedClaim.findMany as jest.Mock).mockResolvedValue(
        oldestViews
      );

      const response = await request(app).post('/api/claims/CLM001/view');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(prisma.recentlyViewedClaim.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          isDeleted: false,
        },
        orderBy: {
          viewedAt: 'asc',
        },
        take: 3,
      });
      expect(prisma.recentlyViewedClaim.updateMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: oldestViews.map((view) => view.id),
          },
        },
        data: expect.objectContaining({
          isDeleted: true,
          deletedAt: expect.any(Date),
        }),
      });
    });

    it('should return 404 if claim not found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/api/claims/INVALID/view');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Claim not found' });
      expect(prisma.recentlyViewedClaim.count).not.toHaveBeenCalled();
      expect(prisma.recentlyViewedClaim.findMany).not.toHaveBeenCalled();
      expect(prisma.recentlyViewedClaim.updateMany).not.toHaveBeenCalled();
      expect(prisma.recentlyViewedClaim.upsert).not.toHaveBeenCalled();
    });
  });
});
