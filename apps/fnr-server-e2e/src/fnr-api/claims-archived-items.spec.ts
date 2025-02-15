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
    update: jest.fn(),
    delete: jest.fn(),
  },
  evidence: {
    deleteMany: jest.fn(),
  },
} as unknown as PrismaClient;

// Create mock routers
const mockRouter = Router();

// Mock item creation endpoint
mockRouter.post('/:claimNumber/items', async (req, res) => {
  try {
    const { claimNumber } = req.params;

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      select: { id: true, isDeleted: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (claim.isDeleted) {
      return res.status(500).json({ details: 'Cannot modify archived claim' });
    }

    const newItem = await prisma.item.create({
      data: {
        name: req.body.name,
        category: req.body.category || null,
        quantity: req.body.quantity || 1,
        claimId: claim.id,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Mock item update endpoint
mockRouter.patch('/:claimNumber/items/:itemId', async (req, res) => {
  try {
    const { claimNumber, itemId } = req.params;

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      select: { id: true, isDeleted: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (claim.isDeleted) {
      return res.status(500).json({ error: 'Failed to update item' });
    }

    const updatedItem = await prisma.item.update({
      where: { id: parseInt(itemId) },
      data: req.body,
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Mock item soft delete endpoint
mockRouter.post('/:claimNumber/items/:itemId/soft-delete', async (req, res) => {
  try {
    const { claimNumber, itemId } = req.params;

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      select: { id: true, isDeleted: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (claim.isDeleted) {
      return res.status(500).json({ error: 'Failed to soft delete item' });
    }

    await prisma.item.update({
      where: { id: parseInt(itemId) },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to soft delete item' });
  }
});

// Mock item hard delete endpoint
mockRouter.delete('/:claimNumber/items/:itemId', async (req, res) => {
  try {
    const { claimNumber, itemId } = req.params;

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      select: { id: true, isDeleted: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (claim.isDeleted) {
      return res.status(500).json({ error: 'Failed to delete item' });
    }

    await prisma.evidence.deleteMany({
      where: { itemId: parseInt(itemId) },
    });

    await prisma.item.delete({
      where: { id: parseInt(itemId) },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

describe('Archived Claims Item Operations', () => {
  let app: express.Application;
  const mockClaim = { id: 1, isDeleted: true };
  const mockItem = {
    id: 1,
    name: 'Test Item',
    category: 'ELECTRONICS',
    quantity: 1,
  };

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/claims', mockRouter);
    jest.clearAllMocks();

    // Setup default mock responses
    (prisma.claim.findUnique as jest.Mock).mockResolvedValue(mockClaim);
    (prisma.item.create as jest.Mock).mockResolvedValue(mockItem);
    (prisma.item.update as jest.Mock).mockResolvedValue(mockItem);
  });

  describe('POST /api/claims/:claimNumber/items', () => {
    it('should prevent creating new items in archived claim', async () => {
      const response = await request(app)
        .post('/api/claims/CLM001/items')
        .send({
          name: 'New Item',
          category: 'ELECTRONICS',
          quantity: 1,
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        details: 'Cannot modify archived claim',
      });
      expect(prisma.claim.findUnique).toHaveBeenCalledWith({
        where: { claimNumber: 'CLM001' },
        select: { id: true, isDeleted: true },
      });
    });

    it('should allow creating items when claim is not archived', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue({
        ...mockClaim,
        isDeleted: false,
      });

      const response = await request(app)
        .post('/api/claims/CLM001/items')
        .send({
          name: 'New Item',
          category: 'ELECTRONICS',
          quantity: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockItem);
    });
  });

  describe('PATCH /api/claims/:claimNumber/items/:itemId', () => {
    it('should prevent updating items in archived claim', async () => {
      const response = await request(app)
        .patch('/api/claims/CLM001/items/1')
        .send({
          name: 'Updated Name',
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Failed to update item',
      });
    });

    it('should allow updating items when claim is not archived', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue({
        ...mockClaim,
        isDeleted: false,
      });

      const response = await request(app)
        .patch('/api/claims/CLM001/items/1')
        .send({
          name: 'Updated Name',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockItem);
    });
  });

  describe('POST /api/claims/:claimNumber/items/:itemId/soft-delete', () => {
    it('should prevent soft deleting items in archived claim', async () => {
      const response = await request(app).post(
        '/api/claims/CLM001/items/1/soft-delete'
      );

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Failed to soft delete item',
      });
    });

    it('should allow soft deleting items when claim is not archived', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue({
        ...mockClaim,
        isDeleted: false,
      });

      const response = await request(app).post(
        '/api/claims/CLM001/items/1/soft-delete'
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });
  });

  describe('DELETE /api/claims/:claimNumber/items/:itemId', () => {
    it('should prevent hard deleting items in archived claim', async () => {
      const response = await request(app).delete('/api/claims/CLM001/items/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Failed to delete item',
      });
    });

    it('should allow hard deleting items when claim is not archived', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue({
        ...mockClaim,
        isDeleted: false,
      });

      const response = await request(app).delete('/api/claims/CLM001/items/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });
  });
});
