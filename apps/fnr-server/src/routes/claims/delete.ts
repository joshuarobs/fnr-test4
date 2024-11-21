import express, { Router } from 'express';
import prisma from '../../lib/prisma';
import { calculateClaimValues } from '../../lib/claimHelpers';

const router: Router = express.Router();

// Hard delete
// DELETE /api/claims/:claimNumber/items/:itemId
router.delete('/:claimNumber/items/:itemId', async (req, res) => {
  try {
    const { claimNumber, itemId } = req.params;

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

      // Hard delete the item
      await tx.item.delete({
        where: { id: parseInt(itemId) },
      });

      // Update claim's localItemIds and itemOrder arrays
      await tx.claim.update({
        where: { id: claim.id },
        data: {
          localItemIds: {
            set: claim.localItemIds.filter((id) => id !== parseInt(itemId)),
          },
          itemOrder: {
            set: claim.itemOrder.filter((id) => id !== parseInt(itemId)),
          },
        },
      });

      // Recalculate claim values
      const values = calculateClaimValues(claim.items);

      // Update claim with calculated values
      await tx.claim.update({
        where: { id: claim.id },
        data: values,
      });

      return { success: true, message: 'Item permanently deleted' };
    });

    res.json(result);
  } catch (error) {
    console.error('Error deleting item:', error);
    if (error.message === 'Claim not found') {
      return res.status(404).json({ error: 'Claim not found' });
    }
    if (error.message === 'Item not found in claim') {
      return res.status(404).json({ error: 'Item not found in claim' });
    }
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Soft delete
// POST /api/claims/:claimNumber/items/:itemId/soft-delete
router.post('/:claimNumber/items/:itemId/soft-delete', async (req, res) => {
  try {
    const { claimNumber, itemId } = req.params;

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

      // Soft delete the item
      await tx.item.update({
        where: { id: parseInt(itemId) },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      // Update claim's localItemIds and itemOrder arrays
      await tx.claim.update({
        where: { id: claim.id },
        data: {
          localItemIds: {
            set: claim.localItemIds.filter((id) => id !== parseInt(itemId)),
          },
          itemOrder: {
            set: claim.itemOrder.filter((id) => id !== parseInt(itemId)),
          },
        },
      });

      // Recalculate claim values
      const values = calculateClaimValues(claim.items);

      // Update claim with calculated values
      await tx.claim.update({
        where: { id: claim.id },
        data: values,
      });

      return { success: true, message: 'Item soft deleted' };
    });

    res.json(result);
  } catch (error) {
    console.error('Error soft deleting item:', error);
    if (error.message === 'Claim not found') {
      return res.status(404).json({ error: 'Claim not found' });
    }
    if (error.message === 'Item not found in claim') {
      return res.status(404).json({ error: 'Item not found in claim' });
    }
    res.status(500).json({ error: 'Failed to soft delete item' });
  }
});

export default router;
