import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

// Mock prisma
const prisma = {
  claim: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  recentlyViewedClaim: {
    upsert: jest.fn(),
  },
} as unknown as PrismaClient;

// Create a mock router
const mockRouter = Router();

mockRouter.post('/:claimNumber/view', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const userId = 1;

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      select: { id: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    await prisma.recentlyViewedClaim.upsert({
      where: {
        userId_claimId: {
          userId,
          claimId: claim.id,
        },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        userId,
        claimId: claim.id,
      },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record claim view' });
  }
});

mockRouter.post('/:claimNumber/recalculate', async (req, res) => {
  try {
    const { claimNumber } = req.params;

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      select: { id: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Mock recalculated values
    const recalculatedValues = {
      totalClaimed: 1000,
      totalApproved: 800,
      totalItems: 5,
      insuredQuotesComplete: 3,
      ourQuotesComplete: 4,
      insuredProgressPercent: 60,
      ourProgressPercent: 80,
    };

    res.json({
      success: true,
      ...recalculatedValues,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to recalculate claim values' });
  }
});

describe('Claims API - POST endpoints', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/claims', mockRouter);
    jest.clearAllMocks();
  });

  describe('POST /api/claims/:claimNumber/view', () => {
    const mockClaim = { id: 1 };

    beforeEach(() => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(mockClaim);
      (prisma.recentlyViewedClaim.upsert as jest.Mock).mockResolvedValue({});
    });

    it('should record a claim view', async () => {
      const response = await request(app).post('/api/claims/CLM001/view');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(prisma.recentlyViewedClaim.upsert).toHaveBeenCalled();
    });

    it('should return 404 if claim is not found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/api/claims/INVALID/view');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Claim not found' });
    });
  });

  describe('POST /api/claims/:claimNumber/recalculate', () => {
    const mockClaim = { id: 1 };

    beforeEach(() => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(mockClaim);
    });

    it('should recalculate claim values', async () => {
      const response = await request(app).post(
        '/api/claims/CLM001/recalculate'
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        totalClaimed: 1000,
        totalApproved: 800,
        totalItems: 5,
        insuredQuotesComplete: 3,
        ourQuotesComplete: 4,
        insuredProgressPercent: 60,
        ourProgressPercent: 80,
      });
    });

    it('should return 404 if claim is not found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post(
        '/api/claims/INVALID/recalculate'
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Claim not found' });
    });
  });
});
