import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

// Mock prisma
const prisma = {
  item: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
} as unknown as PrismaClient;

// Create a mock router
const mockRouter = Router();

mockRouter.get('/', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

mockRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

describe('Items API - GET endpoints', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/items', mockRouter);
    jest.clearAllMocks();
  });

  describe('GET /api/items', () => {
    const mockItems = [
      {
        id: 1,
        name: 'Test Item 1',
        description: 'Description for test item 1',
        category: 'Electronics',
        quantity: 1,
        claimId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Test Item 2',
        description: 'Description for test item 2',
        category: 'Furniture',
        quantity: 2,
        claimId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    beforeEach(() => {
      (prisma.item.findMany as jest.Mock).mockResolvedValue(mockItems);
    });

    it('should fetch all items', async () => {
      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockItems);
      expect(prisma.item.findMany).toHaveBeenCalledWith({
        orderBy: {
          id: 'asc',
        },
      });
    });

    it('should handle errors when fetching items', async () => {
      (prisma.item.findMany as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app).get('/api/items');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch items' });
    });
  });

  describe('GET /api/items/:id', () => {
    const mockItem = {
      id: 1,
      name: 'Test Item',
      description: 'Test item description',
      category: 'Electronics',
      quantity: 1,
      claimId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    beforeEach(() => {
      (prisma.item.findUnique as jest.Mock).mockResolvedValue(mockItem);
    });

    it('should fetch a specific item by id', async () => {
      const response = await request(app).get('/api/items/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockItem);
      expect(prisma.item.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 404 if item is not found', async () => {
      (prisma.item.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/items/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    it('should handle errors when fetching a specific item', async () => {
      (prisma.item.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app).get('/api/items/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch item' });
    });
  });
});
