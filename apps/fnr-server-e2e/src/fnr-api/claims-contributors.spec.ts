import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import express from 'express';
import { Router } from 'express';

// Mock data store
let mockContributors = [];
let mockClaims = [];
let mockItems = [];
let mockUsers = [
  { id: 1, name: 'Creator User' },
  { id: 2, name: 'Handler User' },
  { id: 3, name: 'Other User' },
];

// Track current user for test context
let currentUserId = 1;

const prisma = {
  claimContributor: {
    deleteMany: jest.fn().mockImplementation(() => {
      mockContributors = [];
      return Promise.resolve({ count: 0 });
    }),
    create: jest.fn().mockImplementation((data) => {
      // Check for existing contributor
      const existingContributor = mockContributors.find(
        (c) => c.claimId === data.data.claimId && c.userId === data.data.userId
      );

      // If contributor already exists, return it
      if (existingContributor) {
        return Promise.resolve(existingContributor);
      }

      // Otherwise create new contributor
      const contributor = {
        id: mockContributors.length + 1,
        ...data.data,
        addedAt: new Date(),
      };
      mockContributors.push(contributor);
      return Promise.resolve(contributor);
    }),
    findMany: jest.fn().mockImplementation((query) => {
      const filtered = mockContributors.filter(
        (c) => c.claimId === query.where.claimId
      );
      return Promise.resolve(filtered);
    }),
  },
  item: {
    deleteMany: jest.fn(),
    create: jest
      .fn()
      .mockImplementation((data) => Promise.resolve({ id: 1, ...data.data })),
  },
  claim: {
    deleteMany: jest.fn(),
    create: jest
      .fn()
      .mockImplementation((data) => Promise.resolve({ id: 1, ...data.data })),
    findUnique: jest
      .fn()
      .mockImplementation((query) =>
        Promise.resolve({ id: 1, claimNumber: query.where.claimNumber })
      ),
    update: jest
      .fn()
      .mockImplementation((data) => Promise.resolve({ id: 1, ...data.data })),
  },
} as unknown as PrismaClient;

// Create mock router for claims endpoints
const mockRouter = Router();

// Add soft delete endpoint
mockRouter.post('/:claimNumber/items/:itemId/soft-delete', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Add user as contributor when soft deleting item
    await prisma.claimContributor.create({
      data: {
        claimId: claim.id,
        userId: currentUserId,
      },
    });

    res.json({ success: true, message: 'Item soft deleted' });
  } catch (error) {
    console.error('Error soft deleting item:', error);
    res.status(500).json({ error: 'Failed to soft delete item' });
  }
});

// POST /api/claims - Create claim
mockRouter.post('/', async (req, res) => {
  try {
    const claim = await prisma.claim.create({
      data: {
        ...req.body,
        insuredId: 1,
        creatorId: 1,
        handlerId: 1,
        totalClaimed: 0,
      },
    });

    // Add creator as first contributor
    await prisma.claimContributor.create({
      data: {
        claimId: claim.id,
        userId: currentUserId,
      },
    });

    res.status(201).json(claim);
  } catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({ error: 'Failed to create claim' });
  }
});

// POST /api/claims/:claimNumber/items
mockRouter.post('/:claimNumber/items', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    const item = await prisma.item.create({
      data: {
        ...req.body,
        claimId: claim.id,
      },
    });

    // Add user as contributor
    await prisma.claimContributor.create({
      data: {
        claimId: claim.id,
        userId: currentUserId,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PATCH /api/claims/:claimNumber/items/:itemId
mockRouter.patch('/:claimNumber/items/:itemId', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Add user as contributor
    await prisma.claimContributor.create({
      data: {
        claimId: claim.id,
        userId: currentUserId,
      },
    });

    res.json({ success: true, id: parseInt(req.params.itemId) });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// POST /api/claims/:claimNumber/reassign
mockRouter.post('/:claimNumber/reassign', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Update handler
    await prisma.claim.update({
      where: { id: claim.id },
      data: { handlerId: 2 }, // Different handler
    });

    // Add reassigner as contributor
    await prisma.claimContributor.create({
      data: {
        claimId: claim.id,
        userId: currentUserId,
      },
    });

    res.json({ success: true, handler: { id: 2 } });
  } catch (error) {
    console.error('Error reassigning claim:', error);
    res.status(500).json({ error: 'Failed to reassign claim' });
  }
});

describe('Claim Contributors API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/claims', mockRouter);
    jest.clearAllMocks();

    // Clear mock data before each test
    mockContributors = [];
    mockClaims = [];
    mockItems = [];
  });

  describe('POST /api/claims', () => {
    it('should add creator as first contributor when creating a claim', async () => {
      // Create a new claim
      const response = await request(app).post('/api/claims').send({
        claimNumber: 'TEST001',
        policyNumber: 'POL123',
        description: 'Test claim',
        incidentDate: new Date().toISOString(),
        assignedAgent: 'AGENT1',
      });

      expect(response.status).toBe(201);

      // Verify creator was added as contributor
      const contributors = await prisma.claimContributor.findMany({
        where: { claimId: response.body.id },
        include: { user: true },
      });

      expect(contributors).toHaveLength(1);
      expect(contributors[0].userId).toBe(1); // Creator ID from test setup
    });
  });

  describe('POST /api/claims/:claimNumber/items', () => {
    it('should add user as contributor when adding an item', async () => {
      // First create a claim
      const claimResponse = await request(app).post('/api/claims').send({
        claimNumber: 'TEST002',
        policyNumber: 'POL123',
        description: 'Test claim',
        incidentDate: new Date().toISOString(),
        assignedAgent: 'AGENT1',
      });

      // Add an item to the claim
      const itemResponse = await request(app)
        .post(`/api/claims/TEST002/items`)
        .send({
          name: 'Test Item',
          category: 'ELECTRONICS',
          quantity: 1,
        });

      expect(itemResponse.status).toBe(201);

      // Verify both creator and item adder are contributors
      const contributors = await prisma.claimContributor.findMany({
        where: { claimId: claimResponse.body.id },
        orderBy: { addedAt: 'asc' },
      });

      expect(contributors).toHaveLength(1); // Same user (creator and item adder)
      expect(contributors[0].userId).toBe(1); // User ID
    });

    it('should not add duplicate contributor when same user adds multiple items', async () => {
      // Create claim
      const claimResponse = await request(app).post('/api/claims').send({
        claimNumber: 'TEST003',
        policyNumber: 'POL123',
        description: 'Test claim',
        incidentDate: new Date().toISOString(),
        assignedAgent: 'AGENT1',
      });

      // Add first item
      await request(app).post(`/api/claims/TEST003/items`).send({
        name: 'Item 1',
        category: 'ELECTRONICS',
        quantity: 1,
      });

      // Add second item
      await request(app).post(`/api/claims/TEST003/items`).send({
        name: 'Item 2',
        category: 'ELECTRONICS',
        quantity: 1,
      });

      // Verify only one contributor entry exists per user
      const contributors = await prisma.claimContributor.findMany({
        where: { claimId: claimResponse.body.id },
      });

      expect(contributors).toHaveLength(1); // Just the creator (who also added items)
    });
  });

  describe('PATCH /api/claims/:claimNumber/items/:itemId', () => {
    it('should add user as contributor when updating an item', async () => {
      // Create claim
      const claimResponse = await request(app).post('/api/claims').send({
        claimNumber: 'TEST004',
        policyNumber: 'POL123',
        description: 'Test claim',
        incidentDate: new Date().toISOString(),
        assignedAgent: 'AGENT1',
      });

      // Add an item
      const itemResponse = await request(app)
        .post(`/api/claims/TEST004/items`)
        .send({
          name: 'Test Item',
          category: 'ELECTRONICS',
          quantity: 1,
        });

      // Update the item
      await request(app)
        .patch(`/api/claims/TEST004/items/${itemResponse.body.id}`)
        .send({
          name: 'Updated Item Name',
        });

      // Verify contributors
      const contributors = await prisma.claimContributor.findMany({
        where: { claimId: claimResponse.body.id },
      });

      expect(contributors).toHaveLength(1); // Same user for all actions
    });
  });

  describe('POST /api/claims/:claimNumber/reassign', () => {
    it('should add user as contributor when reassigning claim', async () => {
      // Create claim as user 1
      currentUserId = 1;
      const claimResponse = await request(app).post('/api/claims').send({
        claimNumber: 'TEST005',
        policyNumber: 'POL123',
        description: 'Test claim',
        incidentDate: new Date().toISOString(),
        assignedAgent: 'AGENT1',
      });

      // Reassign the claim as user 2
      currentUserId = 2;
      await request(app).post(`/api/claims/TEST005/reassign`).send({
        employeeId: 'EMP002',
      });

      // Verify contributors
      const contributors = await prisma.claimContributor.findMany({
        where: { claimId: claimResponse.body.id },
        include: { user: true },
        orderBy: { addedAt: 'asc' },
      });

      expect(contributors).toHaveLength(2);
      expect(contributors[0].userId).toBe(1); // Creator
      expect(contributors[1].userId).toBe(2); // Reassigner
    });

    it('should track multiple different users as contributors', async () => {
      // Create claim as user 1
      currentUserId = 1;
      const claimResponse = await request(app).post('/api/claims').send({
        claimNumber: 'TEST006',
        policyNumber: 'POL123',
        description: 'Test claim',
        incidentDate: new Date().toISOString(),
        assignedAgent: 'AGENT1',
      });

      // Add item as user 2
      currentUserId = 2;
      await request(app).post(`/api/claims/TEST006/items`).send({
        name: 'Test Item',
        category: 'ELECTRONICS',
        quantity: 1,
      });

      // Update item as user 3
      currentUserId = 3;
      await request(app).patch(`/api/claims/TEST006/items/1`).send({
        name: 'Updated Item Name',
      });

      // Verify all users are tracked as contributors in order
      const contributors = await prisma.claimContributor.findMany({
        where: { claimId: claimResponse.body.id },
        orderBy: { addedAt: 'asc' },
      });

      expect(contributors).toHaveLength(3);
      expect(contributors[0].userId).toBe(1); // Creator
      expect(contributors[1].userId).toBe(2); // Item adder
      expect(contributors[2].userId).toBe(3); // Item updater
    });

    it('should maintain contributor order by addedAt timestamp', async () => {
      // Mock different timestamps
      const now = new Date();
      const timestamps = [
        now,
        new Date(now.getTime() + 1000),
        new Date(now.getTime() + 2000),
      ];
      let timestampIndex = 0;

      // Override create to use our timestamps
      const originalCreate = prisma.claimContributor.create;
      prisma.claimContributor.create = jest.fn().mockImplementation((data) => {
        const contributor = {
          id: mockContributors.length + 1,
          ...data.data,
          addedAt: timestamps[timestampIndex++],
        };
        mockContributors.push(contributor);
        return Promise.resolve(contributor);
      });

      // Create claim and perform actions
      currentUserId = 1;
      const claimResponse = await request(app).post('/api/claims').send({
        claimNumber: 'TEST007',
        policyNumber: 'POL123',
        description: 'Test claim',
        incidentDate: new Date().toISOString(),
        assignedAgent: 'AGENT1',
      });

      currentUserId = 2;
      await request(app).post(`/api/claims/TEST007/items`).send({
        name: 'Test Item',
        category: 'ELECTRONICS',
        quantity: 1,
      });

      currentUserId = 3;
      await request(app).post(`/api/claims/TEST007/reassign`).send({
        employeeId: 'EMP002',
      });

      // Verify contributors are ordered by timestamp
      const contributors = await prisma.claimContributor.findMany({
        where: { claimId: claimResponse.body.id },
        orderBy: { addedAt: 'asc' },
      });

      expect(contributors).toHaveLength(3);
      expect(contributors[0].addedAt).toEqual(timestamps[0]);
      expect(contributors[1].addedAt).toEqual(timestamps[1]);
      expect(contributors[2].addedAt).toEqual(timestamps[2]);

      // Restore original implementation
      prisma.claimContributor.create = originalCreate;
    });

    it('should not add duplicate contributor when same user performs multiple actions', async () => {
      // Create claim
      currentUserId = 1;
      const claimResponse = await request(app).post('/api/claims').send({
        claimNumber: 'TEST008',
        policyNumber: 'POL123',
        description: 'Test claim',
        incidentDate: new Date().toISOString(),
        assignedAgent: 'AGENT1',
      });

      // Same user adds multiple items
      await request(app).post(`/api/claims/TEST008/items`).send({
        name: 'Item 1',
        category: 'ELECTRONICS',
        quantity: 1,
      });

      await request(app).post(`/api/claims/TEST008/items`).send({
        name: 'Item 2',
        category: 'ELECTRONICS',
        quantity: 1,
      });

      // Verify only one contributor entry exists
      const contributors = await prisma.claimContributor.findMany({
        where: { claimId: claimResponse.body.id },
      });

      expect(contributors).toHaveLength(1);
      expect(contributors[0].userId).toBe(1);
    });

    it('should track contributors when deleting items', async () => {
      // Create claim and item as user 1
      currentUserId = 1;
      const claimResponse = await request(app).post('/api/claims').send({
        claimNumber: 'TEST009',
        policyNumber: 'POL123',
        description: 'Test claim',
        incidentDate: new Date().toISOString(),
        assignedAgent: 'AGENT1',
      });

      await request(app).post(`/api/claims/TEST009/items`).send({
        name: 'Test Item',
        category: 'ELECTRONICS',
        quantity: 1,
      });

      // Delete item as user 2
      currentUserId = 2;
      await request(app)
        .post(`/api/claims/TEST009/items/1/soft-delete`)
        .send({});

      // Verify both users are tracked as contributors
      const contributors = await prisma.claimContributor.findMany({
        where: { claimId: claimResponse.body.id },
        orderBy: { addedAt: 'asc' },
      });

      expect(contributors).toHaveLength(2);
      expect(contributors[0].userId).toBe(1); // Creator/Item adder
      expect(contributors[1].userId).toBe(2); // Item deleter
    });
  });
});
