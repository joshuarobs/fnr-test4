import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

// Mock prisma
const prisma = {
  $transaction: jest.fn((callback) => callback(prisma)),
  claim: {
    create: jest.fn(),
    update: jest.fn(),
  },
  item: {
    create: jest.fn(),
  },
} as unknown as PrismaClient;

// Create a mock router
const mockRouter = Router();

mockRouter.post('/', async (req, res) => {
  try {
    const {
      claimNumber,
      policyNumber,
      description,
      incidentDate,
      blankItems = 0,
      assignedAgent,
    } = req.body;

    if (!claimNumber || !assignedAgent) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['claimNumber', 'assignedAgent'],
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const claim = await tx.claim.create({
        data: {
          claimNumber,
          policyNumber,
          description,
          incidentDate: new Date(incidentDate),
          insuredId: 1,
          creatorId: 1,
          handlerId: 1,
          totalClaimed: 0,
          totalItems: parseInt(blankItems.toString()),
          localItemIds: [],
          itemOrder: [],
        },
      });

      const numBlankItems = parseInt(blankItems.toString());
      const itemIds = [];

      for (let i = 0; i < numBlankItems; i++) {
        const item = await tx.item.create({
          data: {
            name: '',
            quantity: 1,
            itemStatus: 'NR',
            claimId: claim.id,
          },
        });
        itemIds.push(item.id);
      }

      if (itemIds.length > 0) {
        await tx.claim.update({
          where: { id: claim.id },
          data: {
            localItemIds: itemIds,
            itemOrder: itemIds,
          },
        });
      }

      return claim;
    });

    res.status(201).json(result);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Claim number already exists' });
    }
    res.status(500).json({ error: 'Failed to create claim' });
  }
});

describe('Claims API - Create claim', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/claims', mockRouter);
    jest.clearAllMocks();
  });

  describe('POST /api/claims', () => {
    const mockClaim = {
      id: 1,
      claimNumber: 'CLM001',
      policyNumber: 'POL001',
      description: 'Test claim',
      incidentDate: new Date(),
      totalClaimed: 0,
      totalItems: 3,
      localItemIds: [1, 2, 3],
      itemOrder: [1, 2, 3],
    };

    const mockItem = {
      id: 1,
      name: '',
      quantity: 1,
      itemStatus: 'NR',
      claimId: 1,
    };

    beforeEach(() => {
      (prisma.claim.create as jest.Mock).mockResolvedValue(mockClaim);
      (prisma.item.create as jest.Mock).mockResolvedValue(mockItem);
      (prisma.claim.update as jest.Mock).mockResolvedValue(mockClaim);
      (prisma.$transaction as jest.Mock).mockImplementation((callback) =>
        callback(prisma)
      );
    });

    it('should create a claim with no blank items', async () => {
      const response = await request(app).post('/api/claims').send({
        claimNumber: 'CLM001',
        policyNumber: 'POL001',
        description: 'Test claim',
        incidentDate: '2024-01-01',
        assignedAgent: 'John Smith',
        blankItems: 0,
      });

      expect(response.status).toBe(201);
      expect(prisma.item.create).not.toHaveBeenCalled();
      expect(prisma.claim.update).not.toHaveBeenCalled();
    });

    it('should create a claim with blank items', async () => {
      const response = await request(app).post('/api/claims').send({
        claimNumber: 'CLM001',
        policyNumber: 'POL001',
        description: 'Test claim',
        incidentDate: '2024-01-01',
        assignedAgent: 'John Smith',
        blankItems: 3,
      });

      expect(response.status).toBe(201);
      expect(prisma.item.create).toHaveBeenCalledTimes(3);
      expect(prisma.claim.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          localItemIds: [1, 1, 1], // Mock returns same ID each time
          itemOrder: [1, 1, 1],
        },
      });
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/api/claims').send({
        policyNumber: 'POL001',
        description: 'Test claim',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Missing required fields',
        required: ['claimNumber', 'assignedAgent'],
      });
    });

    it('should handle duplicate claim numbers', async () => {
      (prisma.$transaction as jest.Mock).mockRejectedValue({
        code: 'P2002',
      });

      const response = await request(app).post('/api/claims').send({
        claimNumber: 'CLM001',
        policyNumber: 'POL001',
        description: 'Test claim',
        incidentDate: '2024-01-01',
        assignedAgent: 'John Smith',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Claim number already exists' });
    });
  });
});
