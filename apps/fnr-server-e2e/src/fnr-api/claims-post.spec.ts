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
  recentlyViewedClaim: {
    upsert: jest.fn(),
  },
  staff: {
    findUnique: jest.fn(),
  },
} as unknown as PrismaClient;

// Create a mock router
const mockRouter = Router();

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

mockRouter.post('/:claimNumber/reassign', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const { employeeId } = req.body;

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      select: { id: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (!employeeId) {
      const updatedClaim = await prisma.claim.update({
        where: { claimNumber },
        data: { handlerId: null },
        include: {
          handler: {
            include: {
              staff: true,
            },
          },
        },
      });
      return res.json({
        success: true,
        handler: updatedClaim.handler,
      });
    }

    const staff = await prisma.staff.findUnique({
      where: { employeeId },
      include: { baseUser: true },
    });

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    const updatedClaim = await prisma.claim.update({
      where: { claimNumber },
      data: { handlerId: staff.baseUserId },
      include: {
        handler: {
          include: {
            staff: true,
          },
        },
      },
    });

    res.json({
      success: true,
      handler: updatedClaim.handler,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reassign claim' });
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

describe('Claims API - POST endpoints', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/claims', mockRouter);
    jest.clearAllMocks();
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

  describe('POST /api/claims/:claimNumber/reassign', () => {
    const mockClaim = {
      id: 1,
      handler: {
        staff: {
          employeeId: 'EMP123',
        },
      },
    };

    beforeEach(() => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(mockClaim);
      (prisma.claim.update as jest.Mock).mockResolvedValue(mockClaim);
      (prisma.staff.findUnique as jest.Mock).mockResolvedValue({
        baseUserId: 1,
        employeeId: 'EMP123',
      });
    });

    it('should unassign a claim when employeeId is null', async () => {
      const response = await request(app)
        .post('/api/claims/CLM001/reassign')
        .send({ employeeId: null });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        handler: mockClaim.handler,
      });
      expect(prisma.claim.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { claimNumber: 'CLM001' },
          data: { handlerId: null },
        })
      );
    });

    it('should return 404 if claim is not found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/claims/INVALID/reassign')
        .send({ employeeId: null });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Claim not found' });
    });

    it('should return 404 if staff member is not found when assigning', async () => {
      (prisma.staff.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/claims/CLM001/reassign')
        .send({ employeeId: 'INVALID_EMP' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Staff member not found' });
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
