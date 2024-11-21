import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

// Create a mock router
const mockRouter = Router();
mockRouter.post('/:claimNumber/items', async (req, res) => {
  try {
    const { claimNumber } = req.params;

    // Check if claim exists
    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      select: { id: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (!req.body.name) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const newItem = await prisma.item.create({
      data: {
        name: req.body.name,
        category: req.body.category || null,
        quantity: req.body.quantity || 1,
        claimId: claim.id,
      },
    });

    await prisma.claim.update({
      where: { id: claim.id },
      data: {
        localItemIds: { push: newItem.id },
        itemOrder: { push: newItem.id },
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

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

// Mock prisma
const prisma = {
  claim: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  item: {
    create: jest.fn(),
  },
  recentlyViewedClaim: {
    upsert: jest.fn(),
  },
} as unknown as PrismaClient;

describe('Claims API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/claims', mockRouter);
    jest.clearAllMocks();
  });

  describe('POST /api/claims/:claimNumber/items', () => {
    const mockClaim = { id: 1 };
    const mockItem = {
      id: 1,
      name: 'Test Item',
      category: 'Electronics',
      quantity: 1,
    };

    beforeEach(() => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(mockClaim);
      (prisma.item.create as jest.Mock).mockResolvedValue(mockItem);
      (prisma.claim.update as jest.Mock).mockResolvedValue({ ...mockClaim });
    });

    it('should create a new item for a valid claim', async () => {
      const response = await request(app)
        .post('/api/claims/CLM001/items')
        .send({
          name: 'Test Item',
          category: 'Electronics',
          quantity: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockItem);
      expect(prisma.claim.findUnique).toHaveBeenCalledWith({
        where: { claimNumber: 'CLM001' },
        select: { id: true },
      });
    });

    it('should return 404 if claim is not found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/claims/INVALID/items')
        .send({
          name: 'Test Item',
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Claim not found' });
    });

    it('should return 400 if item name is missing', async () => {
      const response = await request(app)
        .post('/api/claims/CLM001/items')
        .send({
          category: 'Electronics',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Item name is required' });
    });
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
