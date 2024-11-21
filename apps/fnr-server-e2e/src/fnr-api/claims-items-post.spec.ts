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
  item: {
    create: jest.fn(),
  },
} as unknown as PrismaClient;

// Create a mock router
const mockRouter = Router();

mockRouter.post('/:claimNumber/items', async (req, res) => {
  try {
    const { claimNumber } = req.params;

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

describe('Items API - POST endpoints', () => {
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
      expect(prisma.item.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Item',
          category: 'Electronics',
          quantity: 1,
          claimId: mockClaim.id,
        },
      });
      expect(prisma.claim.update).toHaveBeenCalledWith({
        where: { id: mockClaim.id },
        data: {
          localItemIds: { push: mockItem.id },
          itemOrder: { push: mockItem.id },
        },
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

    it('should use default values for optional fields', async () => {
      const response = await request(app)
        .post('/api/claims/CLM001/items')
        .send({
          name: 'Test Item',
        });

      expect(response.status).toBe(201);
      expect(prisma.item.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Item',
          category: null,
          quantity: 1,
          claimId: mockClaim.id,
        },
      });
    });
  });
});
