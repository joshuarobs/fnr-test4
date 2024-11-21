import express, { Router } from 'express';
import prisma from '../../lib/prisma';
import { recalculateClaimValues } from '../../lib/claimHelpers';

const router: Router = express.Router();

// DELETE /api/claims/:claimNumber/items/:itemId
router.delete('/:claimNumber/items/:itemId', async (req, res) => {
  try {
    const { claimNumber, itemId } = req.params;
    const parsedItemId = parseInt(itemId);

    console.log(
      `Attempting to delete item ${itemId} from claim ${claimNumber}`
    );

    // First get the claim to ensure it exists
    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      select: { id: true, localItemIds: true, itemOrder: true },
    });

    if (!claim) {
      console.log(`Claim ${claimNumber} not found`);
      return res.status(404).json({ error: 'Claim not found' });
    }

    console.log('Found claim:', claim);

    // Verify the item exists and belongs to this claim
    const item = await prisma.item.findUnique({
      where: { id: parsedItemId },
      select: { id: true, claimId: true },
    });

    if (!item) {
      console.log(`Item ${itemId} not found`);
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.claimId !== claim.id) {
      console.log(`Item ${itemId} does not belong to claim ${claimNumber}`);
      return res
        .status(400)
        .json({ error: 'Item does not belong to this claim' });
    }

    console.log('Found item:', item);

    // Delete the item
    await prisma.item.delete({
      where: { id: parsedItemId },
    });
    console.log('Deleted item');

    // Update the claim's arrays
    await prisma.claim.update({
      where: { id: claim.id },
      data: {
        localItemIds: {
          set: claim.localItemIds.filter((id) => id !== parsedItemId),
        },
        itemOrder: {
          set: claim.itemOrder.filter((id) => id !== parsedItemId),
        },
      },
    });
    console.log('Updated claim arrays');

    // Recalculate claim values
    await recalculateClaimValues(claim.id);
    console.log('Recalculated claim values');

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Detailed error deleting item:', error);
    res
      .status(500)
      .json({ error: 'Failed to delete item', details: error.message });
  }
});

export default router;
