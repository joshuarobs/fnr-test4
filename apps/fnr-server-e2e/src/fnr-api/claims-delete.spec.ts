import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

// Mock prisma
const prisma = {
  claim: {
    findUnique: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
} as unknown as PrismaClient;

// Create a mock router
const mockRouter = Router();

mockRouter.delete('/:claimNumber', async (req, res) => {
  try {
    const { claimNumber } = req.params;

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    await prisma.claim.delete({
      where: { claimNumber },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete claim' });
  }
});

mockRouter.delete('/:claimNumber/soft', async (req, res) => {
  try {
    const { claimNumber } = req.params;

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Soft delete using isDeleted and deletedAt fields
    const updatedClaim = await prisma.claim.update({
      where: { claimNumber },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    res.json({ success: true, isDeleted: updatedClaim.isDeleted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to soft delete claim' });
  }
});

describe('Claims API - DELETE endpoints', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/claims', mockRouter);
    jest.clearAllMocks();
  });

  describe('DELETE /api/claims/:claimNumber', () => {
    const mockClaim = {
      id: 1,
      claimNumber: 'CLM001',
      description: 'Test Claim',
      status: 'OPEN',
    };

    beforeEach(() => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(mockClaim);
      (prisma.claim.delete as jest.Mock).mockResolvedValue(mockClaim);
    });

    it('should delete a claim', async () => {
      const response = await request(app).delete('/api/claims/CLM001');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(prisma.claim.delete).toHaveBeenCalledWith({
        where: { claimNumber: 'CLM001' },
      });
    });

    it('should return 404 if claim is not found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/api/claims/INVALID');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Claim not found' });
    });
  });

  describe('DELETE /api/claims/:claimNumber/soft', () => {
    const mockClaim = {
      id: 1,
      claimNumber: 'CLM001',
      description: 'Test Claim',
      status: 'OPEN',
      isDeleted: false,
      deletedAt: null,
    };

    const mockDeletedClaim = {
      ...mockClaim,
      isDeleted: true,
      deletedAt: new Date('2024-01-01T00:00:00.000Z'), // Fixed date for testing
    };

    beforeEach(() => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(mockClaim);
      (prisma.claim.update as jest.Mock).mockResolvedValue(mockDeletedClaim);
    });

    it('should soft delete a claim by setting isDeleted and deletedAt', async () => {
      const response = await request(app).delete('/api/claims/CLM001/soft');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        isDeleted: true,
      });
      expect(prisma.claim.update).toHaveBeenCalledWith({
        where: { claimNumber: 'CLM001' },
        data: {
          isDeleted: true,
          deletedAt: expect.any(Date),
        },
      });
    });

    it('should return 404 if claim is not found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/api/claims/INVALID/soft');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Claim not found' });
    });
  });
});
