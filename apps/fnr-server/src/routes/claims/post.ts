import express, { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma';
import {
  calculateClaimValues,
  recalculateClaimValues,
} from '../../lib/claimHelpers';

const router: Router = express.Router();

// POST /api/claims - Create a new claim
router.post('/', async (req, res) => {
  try {
    const {
      claimNumber,
      policyNumber,
      description,
      incidentDate,
      blankItems = 0,
      assignedAgent,
    } = req.body;

    // Validate required fields
    if (!claimNumber || !assignedAgent) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['claimNumber', 'assignedAgent'],
      });
    }

    // TODO: Get actual user IDs from auth
    const insuredId = 1;
    const creatorId = 1;
    const handlerId = 1;

    // Use transaction to create claim and blank items atomically
    const result = await prisma.$transaction(async (tx) => {
      // Create initial claim with required fields
      const claim = await tx.claim.create({
        data: {
          claimNumber,
          policyNumber,
          description,
          incidentDate: new Date(incidentDate),
          insuredId,
          creatorId,
          handlerId,
          totalItems: parseInt(blankItems.toString()),
          localItemIds: [],
          itemOrder: [],
          // Required fields with initial values
          totalClaimed: 0,
          insuredQuotesComplete: 0,
          insuredProgressPercent: 0,
          ourQuotesComplete: 0,
          ourProgressPercent: 0,
          lastProgressUpdate: new Date(),
        },
      });

      // Recalculate claim values to ensure consistency
      await recalculateClaimValues(claim.id, tx);

      // Create blank items if specified
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

      // Update claim with item IDs if any items were created
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
    console.error('Error creating claim:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Claim number already exists' });
    }
    res.status(500).json({ error: 'Failed to create claim' });
  }
});

// Validation middleware
const validateItemRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Item name is required' });
  }
  next();
};

// POST /api/claims/:claimNumber/items
router.post('/:claimNumber/items', validateItemRequest, async (req, res) => {
  try {
    const { claimNumber } = req.params;
    console.log('Creating item for claim:', claimNumber);

    // Use a single transaction for all operations
    const result = await prisma.$transaction(async (tx) => {
      // Get claim with existing items for calculation
      const claim = await tx.claim.findUnique({
        where: { claimNumber },
        select: {
          id: true,
          localItemIds: true,
          itemOrder: true,
          items: {
            select: {
              insuredsQuote: true,
              ourQuote: true,
              quantity: true,
            },
          },
        },
      });

      if (!claim) {
        throw new Error('Claim not found');
      }

      // Create the new item
      const newItem = await tx.item.create({
        data: {
          name: req.body.name,
          category: req.body.category || null,
          roomCategory: req.body.roomCategory || null, // Added roomCategory field
          group: req.body.group || null,
          modelSerialNumber: req.body.modelSerialNumber || null,
          description: req.body.description || null,
          quantity: req.body.quantity || 1,
          purchaseDate: req.body.purchaseDate
            ? new Date(req.body.purchaseDate)
            : null,
          age: req.body.age || null,
          condition: req.body.condition || null,
          insuredsQuote: req.body.insuredsQuote || null,
          ourQuote: req.body.ourQuote || null,
          ourQuoteProof: req.body.ourQuoteProof || null,
          itemStatus: req.body.itemStatus || 'NR',
          claimId: claim.id,
        },
      });

      // Calculate new totals including the new item
      const allItems = [
        ...claim.items,
        {
          insuredsQuote: newItem.insuredsQuote,
          ourQuote: newItem.ourQuote,
          quantity: newItem.quantity,
        },
      ];

      const values = calculateClaimValues(allItems);

      // Update claim with new item and calculated values in one operation
      await tx.claim.update({
        where: { id: claim.id },
        data: {
          localItemIds: { set: [...(claim.localItemIds || []), newItem.id] },
          itemOrder: { set: [...(claim.itemOrder || []), newItem.id] },
          ...values,
        },
      });

      return newItem;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Detailed error creating item:', error);
    if (error.message === 'Claim not found') {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res
      .status(500)
      .json({ error: 'Failed to create item', details: error.message });
  }
});

// PATCH /api/claims/:claimNumber/items/:itemId
router.patch('/:claimNumber/items/:itemId', async (req, res) => {
  try {
    const { claimNumber, itemId } = req.params;
    const {
      name,
      category,
      group,
      modelSerialNumber,
      description,
      purchaseDate,
      age,
      condition,
      insuredsQuote,
      ourQuote,
      ourQuoteProof,
      itemStatus,
      roomCategory,
      quantity,
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // First verify the claim exists and the item belongs to it
      const claim = await tx.claim.findUnique({
        where: { claimNumber },
        include: {
          items: {
            where: { id: parseInt(itemId) },
          },
        },
      });

      if (!claim) {
        throw new Error('Claim not found');
      }

      if (claim.items.length === 0) {
        throw new Error('Item not found in claim');
      }

      // Build update data object with all possible fields
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (category !== undefined) updateData.category = category;
      if (group !== undefined) updateData.group = group;
      if (modelSerialNumber !== undefined)
        updateData.modelSerialNumber = modelSerialNumber;
      if (description !== undefined) updateData.description = description;
      if (purchaseDate !== undefined) updateData.purchaseDate = purchaseDate;
      if (age !== undefined) updateData.age = age;
      if (condition !== undefined) updateData.condition = condition;
      if (insuredsQuote !== undefined) updateData.insuredsQuote = insuredsQuote;
      if (ourQuote !== undefined) updateData.ourQuote = ourQuote;
      if (ourQuoteProof !== undefined) updateData.ourQuoteProof = ourQuoteProof;
      if (itemStatus !== undefined) updateData.itemStatus = itemStatus;
      if (roomCategory !== undefined) updateData.roomCategory = roomCategory;
      if (quantity !== undefined) updateData.quantity = quantity;

      // Update the item
      const updatedItem = await tx.item.update({
        where: { id: parseInt(itemId) },
        data: updateData,
      });

      // Get all items with the updated item for recalculation
      const allItems = await tx.item.findMany({
        where: { claimId: claim.id },
        select: {
          insuredsQuote: true,
          ourQuote: true,
          quantity: true,
        },
      });

      // Recalculate claim values with updated items
      const values = calculateClaimValues(allItems);

      // Update claim with calculated values
      await tx.claim.update({
        where: { id: claim.id },
        data: values,
      });

      return updatedItem;
    });

    res.json(result);
  } catch (error) {
    console.error('Error updating item:', error);
    if (error.message === 'Claim not found') {
      return res.status(404).json({ error: 'Claim not found' });
    }
    if (error.message === 'Item not found in claim') {
      return res.status(404).json({ error: 'Item not found in claim' });
    }
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// POST /api/claims/:claimNumber/view
router.post('/:claimNumber/view', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    // TODO: Get actual user ID from auth
    const userId = 1;

    const result = await prisma.$transaction(async (tx) => {
      const claim = await tx.claim.findUnique({
        where: { claimNumber },
        select: { id: true },
      });

      if (!claim) {
        throw new Error('Claim not found');
      }

      return tx.recentlyViewedClaim.upsert({
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
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error recording claim view:', error);
    if (error.message === 'Claim not found') {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.status(500).json({ error: 'Failed to record claim view' });
  }
});

// POST /api/claims/:claimNumber/recalculate
// POST /api/claims/:claimNumber/reassign
router.post('/:claimNumber/reassign', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Find the staff member by employee ID
      const staff = await tx.staff.findUnique({
        where: { employeeId },
        include: { baseUser: true },
      });

      if (!staff) {
        throw new Error('Staff member not found');
      }

      // Update the claim with the new handler
      const updatedClaim = await tx.claim.update({
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

      return updatedClaim;
    });

    res.json({
      success: true,
      handler: result.handler,
    });
  } catch (error) {
    console.error('Error reassigning claim:', error);
    if (error.message === 'Staff member not found') {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.status(500).json({ error: 'Failed to reassign claim' });
  }
});

router.post('/:claimNumber/recalculate', async (req, res) => {
  try {
    const { claimNumber } = req.params;

    const result = await prisma.$transaction(async (tx) => {
      const claim = await tx.claim.findUnique({
        where: { claimNumber },
        include: {
          items: {
            select: {
              insuredsQuote: true,
              ourQuote: true,
              quantity: true,
            },
          },
        },
      });

      if (!claim) {
        throw new Error('Claim not found');
      }

      const values = calculateClaimValues(claim.items);

      return tx.claim.update({
        where: { id: claim.id },
        data: values,
      });
    });

    res.json({
      success: true,
      totalClaimed: result.totalClaimed,
      totalApproved: result.totalApproved,
      totalItems: result.totalItems,
      insuredQuotesComplete: result.insuredQuotesComplete,
      ourQuotesComplete: result.ourQuotesComplete,
      insuredProgressPercent: result.insuredProgressPercent,
      ourProgressPercent: result.ourProgressPercent,
      lastProgressUpdate: result.lastProgressUpdate, // Added this field
    });
  } catch (error) {
    console.error('Error recalculating claim values:', error);
    if (error.message === 'Claim not found') {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.status(500).json({ error: 'Failed to recalculate claim values' });
  }
});

export default router;
