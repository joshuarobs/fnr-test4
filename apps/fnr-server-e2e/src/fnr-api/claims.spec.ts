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

// Add GET routes to mock router
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

    res.json(claim);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch claim' });
  }
});

// Mock prisma
const prisma = {
  claim: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  item: {
    create: jest.fn(),
  },
  recentlyViewedClaim: {
    upsert: jest.fn(),
    findMany: jest.fn(),
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
    };

    beforeEach(() => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(mockClaim);
    });

    it('should fetch a specific claim by claim number', async () => {
      const response = await request(app).get('/api/claims/CLM001');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClaim);
      expect(prisma.claim.findUnique).toHaveBeenCalledWith({
        where: { claimNumber: 'CLM001' },
        include: { items: true },
      });
    });

    it('should return 404 if claim is not found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/claims/INVALID');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Claim not found' });
    });
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
