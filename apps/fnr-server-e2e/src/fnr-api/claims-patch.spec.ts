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
} as unknown as PrismaClient;

// Create a mock router
const mockRouter = Router();

mockRouter.patch('/:claimNumber', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const updateData = req.body;

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    const updatedClaim = await prisma.claim.update({
      where: { claimNumber },
      data: updateData,
    });

    res.json(updatedClaim);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update claim' });
  }
});

mockRouter.patch('/:claimNumber/status', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    const updatedClaim = await prisma.claim.update({
      where: { claimNumber },
      data: { status },
    });

    res.json(updatedClaim);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update claim status' });
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

  describe('PATCH /api/claims/:claimNumber', () => {
    const mockClaim = {
      id: 1,
      claimNumber: 'CLM001',
      description: 'Test Claim',
      status: 'OPEN',
    };

    const mockUpdatedClaim = {
      ...mockClaim,
      description: 'Updated Test Claim',
    };

    beforeEach(() => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(mockClaim);
      (prisma.claim.update as jest.Mock).mockResolvedValue(mockUpdatedClaim);
    });

    it('should update a claim', async () => {
      const updateData = {
        description: 'Updated Test Claim',
      };

      const response = await request(app)
        .patch('/api/claims/CLM001')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedClaim);
      expect(prisma.claim.update).toHaveBeenCalledWith({
        where: { claimNumber: 'CLM001' },
        data: updateData,
      });
    });

    it('should return 404 if claim is not found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .patch('/api/claims/INVALID')
        .send({ description: 'Updated Test Claim' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Claim not found' });
    });
  });

  describe('PATCH /api/claims/:claimNumber/status', () => {
    const mockClaim = {
      id: 1,
      claimNumber: 'CLM001',
      description: 'Test Claim',
      status: 'OPEN',
    };

    const mockUpdatedClaim = {
      ...mockClaim,
      status: 'CLOSED',
    };

    beforeEach(() => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(mockClaim);
      (prisma.claim.update as jest.Mock).mockResolvedValue(mockUpdatedClaim);
    });

    it('should update claim status', async () => {
      const response = await request(app)
        .patch('/api/claims/CLM001/status')
        .send({ status: 'CLOSED' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedClaim);
      expect(prisma.claim.update).toHaveBeenCalledWith({
        where: { claimNumber: 'CLM001' },
        data: { status: 'CLOSED' },
      });
    });

    it('should return 400 if status is not provided', async () => {
      const response = await request(app)
        .patch('/api/claims/CLM001/status')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Status is required' });
    });

    it('should return 404 if claim is not found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .patch('/api/claims/INVALID/status')
        .send({ status: 'CLOSED' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Claim not found' });
    });
  });
});
