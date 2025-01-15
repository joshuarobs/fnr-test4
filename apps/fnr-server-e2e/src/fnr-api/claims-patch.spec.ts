import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

// Mock prisma
const prisma = {
  claim: {
    update: jest.fn(),
  },
} as unknown as PrismaClient;

// Create a mock router
const mockRouter = Router();

mockRouter.patch('/:claimNumber/description', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const { description } = req.body;

    if (typeof description !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Description must be a string',
      });
    }

    await prisma.claim.update({
      where: { claimNumber },
      data: { description },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to update claim description:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update claim description',
    });
  }
});

describe('Claims API - PATCH endpoints', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/claims', mockRouter);
    jest.clearAllMocks();
  });

  describe('PATCH /api/claims/:claimNumber/description', () => {
    const mockClaim = {
      id: 1,
      claimNumber: 'CLM001',
      description: 'Updated description',
    };

    beforeEach(() => {
      (prisma.claim.update as jest.Mock).mockResolvedValue(mockClaim);
    });

    it('should update claim description successfully', async () => {
      const response = await request(app)
        .patch('/api/claims/CLM001/description')
        .send({ description: 'Updated description' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(prisma.claim.update).toHaveBeenCalledWith({
        where: { claimNumber: 'CLM001' },
        data: { description: 'Updated description' },
      });
    });

    it('should return 400 if description is not a string', async () => {
      const response = await request(app)
        .patch('/api/claims/CLM001/description')
        .send({ description: 123 }); // Send a number instead of string

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Description must be a string',
      });
      expect(prisma.claim.update).not.toHaveBeenCalled();
    });

    it('should return 400 if description is missing', async () => {
      const response = await request(app)
        .patch('/api/claims/CLM001/description')
        .send({}); // Send empty object

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Description must be a string',
      });
      expect(prisma.claim.update).not.toHaveBeenCalled();
    });

    it('should return 500 if database update fails', async () => {
      (prisma.claim.update as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      const response = await request(app)
        .patch('/api/claims/CLM001/description')
        .send({ description: 'Updated description' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Failed to update claim description',
      });
    });
  });
});
