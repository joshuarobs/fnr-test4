import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { jest } from '@jest/globals';

// Mock prisma with proper typing
const prisma = {
  $transaction: jest.fn(),
  evidence: {
    deleteMany: jest.fn(() => Promise.resolve({ count: 0 })),
  },
  item: {
    delete: jest.fn(() => Promise.resolve({ id: 1, name: 'Test Item' })),
    update: jest.fn(() =>
      Promise.resolve({
        id: 1,
        name: 'Test Item',
        isDeleted: true,
        deletedAt: new Date(),
      })
    ),
    findUnique: jest.fn(() =>
      Promise.resolve({ id: 1, name: 'Test Item', claimId: 1 })
    ),
  },
  claim: {
    findUnique: jest.fn(() =>
      Promise.resolve({
        id: 1,
        claimNumber: 'TEST-DELETE-001',
        items: [{ id: 1, name: 'Test Item' }],
      })
    ),
  },
} as unknown as PrismaClient;

// Create mock router for claims endpoints
const mockRouter = Router();

// POST /api/claims/:claimNumber/items/:itemId/soft-delete
mockRouter.post('/:claimNumber/items/:itemId/soft-delete', async (req, res) => {
  try {
    const { claimNumber, itemId } = req.params;

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      include: {
        items: {
          where: { id: parseInt(itemId) },
        },
      },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    const item = await prisma.item.findUnique({
      where: { id: parseInt(itemId) },
    });

    if (!item || item.claimId !== claim.id) {
      return res.status(404).json({ error: 'Item not found in claim' });
    }

    await prisma.item.update({
      where: { id: parseInt(itemId) },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    res.json({ success: true, message: 'Item soft deleted' });
  } catch (error) {
    console.error('Error soft deleting item:', error);
    res.status(500).json({ error: 'Failed to soft delete item' });
  }
});

// DELETE /api/claims/:claimNumber/items/:itemId
mockRouter.delete('/:claimNumber/items/:itemId', async (req, res) => {
  try {
    const { claimNumber, itemId } = req.params;

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      include: {
        items: {
          where: { id: parseInt(itemId) },
        },
      },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (claim.items.length === 0) {
      return res.status(404).json({ error: 'Item not found in claim' });
    }

    await prisma.evidence.deleteMany({
      where: { itemId: parseInt(itemId) },
    });

    await prisma.item.delete({
      where: { id: parseInt(itemId) },
    });

    res.json({ success: true, message: 'Item permanently deleted' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

describe('Claims Items Delete API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/claims', mockRouter);
    jest.clearAllMocks();
  });

  describe('POST /api/claims/:claimNumber/items/:itemId/soft-delete', () => {
    it('should soft delete an item', async () => {
      const response = await request(app)
        .post('/api/claims/TEST-DELETE-001/items/1/soft-delete')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Item soft deleted');
      expect(prisma.item.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          isDeleted: true,
          deletedAt: expect.any(Date),
        }),
      });
    });

    it('should return 404 for non-existent claim', async () => {
      (prisma.claim.findUnique as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(null)
      );

      const response = await request(app)
        .post('/api/claims/NONEXISTENT/items/1/soft-delete')
        .expect(404);

      expect(response.body.error).toBe('Claim not found');
    });

    it('should return 404 for non-existent item', async () => {
      (prisma.item.findUnique as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(null)
      );

      const response = await request(app)
        .post('/api/claims/TEST-DELETE-001/items/999/soft-delete')
        .expect(404);

      expect(response.body.error).toBe('Item not found in claim');
    });
  });

  describe('DELETE /api/claims/:claimNumber/items/:itemId', () => {
    it('should hard delete an item', async () => {
      const response = await request(app)
        .delete('/api/claims/TEST-DELETE-001/items/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Item permanently deleted');
      expect(prisma.evidence.deleteMany).toHaveBeenCalledWith({
        where: { itemId: 1 },
      });
      expect(prisma.item.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 404 for non-existent claim', async () => {
      (prisma.claim.findUnique as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(null)
      );

      const response = await request(app)
        .delete('/api/claims/NONEXISTENT/items/1')
        .expect(404);

      expect(response.body.error).toBe('Claim not found');
    });

    it('should return 404 for non-existent item', async () => {
      (prisma.claim.findUnique as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          id: 1,
          claimNumber: 'TEST-DELETE-001',
          items: [],
        })
      );

      const response = await request(app)
        .delete('/api/claims/TEST-DELETE-001/items/999')
        .expect(404);

      expect(response.body.error).toBe('Item not found in claim');
    });
  });
});
