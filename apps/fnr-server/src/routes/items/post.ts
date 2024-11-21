import express, { Router } from 'express';
import prisma from '../../lib/prisma';
import { recalculateClaimValues } from '../../lib/claimHelpers';

const router: Router = express.Router();

// POST /api/items
router.post('/', async (req, res) => {
  try {
    // Use transaction to create item and update claim
    const result = await prisma.$transaction(async (prisma) => {
      // Create the new item
      const newItem = await prisma.item.create({
        data: req.body,
      });

      // Update the claim's localItemIds array
      await prisma.claim.update({
        where: { id: req.body.claimId },
        data: {
          localItemIds: {
            push: newItem.id,
          },
          itemOrder: {
            push: newItem.id,
          },
        },
      });

      // Recalculate claim values
      await recalculateClaimValues(req.body.claimId);

      return newItem;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

export default router;
