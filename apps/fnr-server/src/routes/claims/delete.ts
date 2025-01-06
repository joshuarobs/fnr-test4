import express, { Router } from 'express';
import prisma from '../../lib/prisma';
import { recalculateClaimValues } from '../../lib/claimHelpers';

const router: Router = express.Router();

// Soft delete item
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

      // Add user as contributor when they soft delete an item
      // TODO: Get actual user ID from auth
      const userId = 1;
      await tx.claimContributor.upsert({
        where: {
          claimId_userId: {
            claimId: claim.id,
            userId,
          },
        },
        create: {
          claimId: claim.id,
          userId,
        },
        update: {}, // No update needed since we just want to ensure it exists
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

      // Delete any associated evidence first
      await tx.evidence.deleteMany({
        where: { itemId: parseInt(itemId) },
      });

      // Hard delete the item
      await tx.item.delete({
        where: { id: parseInt(itemId) },
      });

      // Update claim's arrays and recalculate values
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

      // Recalculate claim values using the helper function
      await recalculateClaimValues(claim.id, tx);

      // Add user as contributor when they hard delete an item
      // TODO: Get actual user ID from auth
      const userId = 1;
      await tx.claimContributor.upsert({
        where: {
          claimId_userId: {
            claimId: claim.id,
            userId,
          },
        },
        create: {
          claimId: claim.id,
          userId,
        },
        update: {}, // No update needed since we just want to ensure it exists
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

// Archive claim
// POST /api/claims/:claimNumber/archive
router.post('/:claimNumber/archive', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const { userId, reason } = req.body;
    const parsedUserId = parseInt(userId);

    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedClaim = await tx.claim.update({
        where: { claimNumber },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: parsedUserId,
          deleteReason: reason,
        },
      });

      // Add user as contributor when they archive a claim
      await tx.claimContributor.upsert({
        where: {
          claimId_userId: {
            claimId: updatedClaim.id,
            userId: parsedUserId,
          },
        },
        create: {
          claimId: updatedClaim.id,
          userId: parsedUserId,
        },
        update: {}, // No update needed since we just want to ensure it exists
      });

      return updatedClaim;
    });

    res.json({ success: true, message: 'Claim archived', claim: result });
  } catch (error) {
    console.error('Error archiving claim:', error);
    res.status(500).json({ error: 'Failed to archive claim' });
  }
});

// Unarchive claim
// POST /api/claims/:claimNumber/unarchive
router.post('/:claimNumber/unarchive', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const { userId } = req.body;
    const parsedUserId = parseInt(userId);

    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedClaim = await tx.claim.update({
        where: { claimNumber },
        data: {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
          deleteReason: null,
        },
      });

      // Add user as contributor when they unarchive a claim
      await tx.claimContributor.upsert({
        where: {
          claimId_userId: {
            claimId: updatedClaim.id,
            userId: parsedUserId,
          },
        },
        create: {
          claimId: updatedClaim.id,
          userId: parsedUserId,
        },
        update: {}, // No update needed since we just want to ensure it exists
      });

      return updatedClaim;
    });

    res.json({
      success: true,
      message: 'Claim unarchived',
      claim: result,
    });
  } catch (error) {
    console.error('Error unarchiving claim:', error);
    res.status(500).json({ error: 'Failed to unarchive claim' });
  }
});

export default router;
