import { expect, test } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

// Mock data store
let mockItems = [];
let mockClaims = [];
let mockEvidence = [];

const prisma = {
  evidence: {
    deleteMany: jest.fn().mockImplementation(() => {
      mockEvidence = [];
      return Promise.resolve({ count: 0 });
    }),
  },
  item: {
    delete: jest.fn().mockImplementation((data) => {
      const itemId = data.where.id;
      const itemIndex = mockItems.findIndex((i) => i.id === itemId);
      if (itemIndex === -1) return Promise.reject(new Error('Item not found'));
      const deletedItem = mockItems.splice(itemIndex, 1)[0];
      return Promise.resolve(deletedItem);
    }),
    update: jest.fn().mockImplementation((data) => {
      const itemId = data.where.id;
      const itemIndex = mockItems.findIndex((i) => i.id === itemId);
      if (itemIndex === -1) return Promise.reject(new Error('Item not found'));
      mockItems[itemIndex] = { ...mockItems[itemIndex], ...data.data };
      return Promise.resolve(mockItems[itemIndex]);
    }),
    findUnique: jest.fn().mockImplementation((query) => {
      const item = mockItems.find((i) => i.id === query.where.id);
      return Promise.resolve(item || null);
    }),
  },
  claim: {
    findUnique: jest.fn().mockImplementation((query) => {
      const claim = mockClaims.find(
        (c) => c.claimNumber === query.where.claimNumber
      );
      if (!claim) return Promise.resolve(null);

      if (query.include?.items) {
        const items = mockItems.filter((i) => i.claimId === claim.id);
        return Promise.resolve({ ...claim, items });
      }

      return Promise.resolve(claim);
    }),
    update: jest.fn().mockImplementation((data) => {
      const claimId = data.where.id;
      const claimIndex = mockClaims.findIndex((c) => c.id === claimId);
      if (claimIndex === -1)
        return Promise.reject(new Error('Claim not found'));
      mockClaims[claimIndex] = { ...mockClaims[claimIndex], ...data.data };
      return Promise.resolve(mockClaims[claimIndex]);
    }),
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
  let testClaimNumber: string;
  let testItemId: number;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/claims', mockRouter);
    jest.clearAllMocks();

    // Reset mock data
    mockItems = [];
    mockClaims = [];
    mockEvidence = [];

    // Set up test data
    const claim = {
      id: 1,
      claimNumber: 'TEST-DELETE-001',
      localItemIds: [1],
      itemOrder: [1],
    };
    mockClaims.push(claim);

    const item = {
      id: 1,
      claimId: claim.id,
      name: 'Test Item',
      quantity: 1,
    };
    mockItems.push(item);

    testClaimNumber = claim.claimNumber;
    testItemId = item.id;
  });

  test('should soft delete an item', async () => {
    const response = await request(app)
      .post(`/api/claims/${testClaimNumber}/items/${testItemId}/soft-delete`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Item soft deleted');

    // Verify the item is soft deleted
    const item = await prisma.item.findUnique({
      where: { id: testItemId },
    });

    expect(item?.isDeleted).toBe(true);
    expect(item?.deletedAt).toBeTruthy();
  });

  test('should hard delete an item', async () => {
    const response = await request(app)
      .delete(`/api/claims/${testClaimNumber}/items/${testItemId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Item permanently deleted');

    // Verify the item is completely deleted
    const item = await prisma.item.findUnique({
      where: { id: testItemId },
    });

    expect(item).toBeNull();
  });

  test('should return 404 for non-existent claim', async () => {
    const response = await request(app)
      .post(`/api/claims/NONEXISTENT/items/1/soft-delete`)
      .expect(404);

    expect(response.body.error).toBe('Claim not found');
  });

  test('should return 404 for non-existent item', async () => {
    const response = await request(app)
      .post(`/api/claims/${testClaimNumber}/items/999999/soft-delete`)
      .expect(404);

    expect(response.body.error).toBe('Item not found in claim');
  });
});
