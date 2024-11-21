import express, { Router } from 'express';
import prisma from '../../lib/prisma';
import { recalculateClaimValues } from '../../lib/claimHelpers';

const router: Router = express.Router();

// DELETE /api/items/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const itemId = parseInt(id);

    // Use transaction to delete item and update claim
    const result = await prisma.$transaction(async (prisma) => {
      // First get the item to know its claimId
      const item = await prisma.item.findUnique({
        where: { id: itemId },
      });

      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      // Delete the item
      await prisma.item.delete({
        where: { id: itemId },
      });

      // Update the claim's localItemIds and itemOrder arrays
      await prisma.claim.update({
        where: { id: item.claimId },
        data: {
          localItemIds: {
            set: await prisma.claim
              .findUnique({ where: { id: item.claimId } })
              .then(
                (claim) =>
                  claim?.localItemIds.filter((id) => id !== itemId) || []
              ),
          },
          itemOrder: {
            set: await prisma.claim
              .findUnique({ where: { id: item.claimId } })
              .then(
                (claim) => claim?.itemOrder.filter((id) => id !== itemId) || []
              ),
          },
        },
      });

      // Recalculate claim values
      await recalculateClaimValues(item.claimId);

      return { success: true, message: 'Item deleted successfully' };
    });

    res.json(result);
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
