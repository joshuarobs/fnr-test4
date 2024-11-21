import express, { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma';
import { calculateClaimValues } from '../../lib/claimHelpers';

const router: Router = express.Router();

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
      itemStatus,
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
      if (itemStatus !== undefined) updateData.itemStatus = itemStatus;

      // Update the item
      const updatedItem = await tx.item.update({
        where: { id: parseInt(itemId) },
        data: updateData,
      });

      // Recalculate claim values
      const values = calculateClaimValues(claim.items);

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
