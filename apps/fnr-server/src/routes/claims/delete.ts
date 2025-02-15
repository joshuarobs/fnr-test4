import express, { Router } from 'express';
import prisma from '../../lib/prisma';
import { recalculateClaimValues } from '../../lib/claimHelpers';
import { isAuthenticated } from '../../middleware/auth';

const router: Router = express.Router();

// Soft delete item
// POST /api/claims/:claimNumber/items/:itemId/soft-delete
router.post(
  '/:claimNumber/items/:itemId/soft-delete',
  isAuthenticated,
  async (req, res) => {
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

        if (claim.isDeleted) {
          throw new Error('Cannot modify archived claim');
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

        // Add authenticated user as contributor when they soft delete an item
        if (!req.user) {
          throw new Error('Unauthorized');
        }
        const userId = req.user.id;
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

        // Log item soft delete
        await tx.activityLog.create({
          data: {
            activityType: 'ITEM_DELETED',
            userId,
            claimId: claim.id,
            metadata: {
              deleteType: 'soft',
              itemId: parseInt(itemId),
              itemName: claim.items[0].name,
            },
            items: {
              create: {
                itemId: parseInt(itemId),
              },
            },
          },
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
      if (error.message === 'Unauthorized') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      res.status(500).json({ error: 'Failed to soft delete item' });
    }
  }
);

// Hard delete
// DELETE /api/claims/:claimNumber/items/:itemId
router.delete(
  '/:claimNumber/items/:itemId',
  isAuthenticated,
  async (req, res) => {
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

        if (claim.isDeleted) {
          throw new Error('Cannot modify archived claim');
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

        // Add authenticated user as contributor when they hard delete an item
        if (!req.user) {
          throw new Error('Unauthorized');
        }
        const userId = req.user.id;
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

        // Log item hard delete
        await tx.activityLog.create({
          data: {
            activityType: 'ITEM_DELETED',
            userId,
            claimId: claim.id,
            metadata: {
              deleteType: 'hard',
              itemId: parseInt(itemId),
              itemName: claim.items[0].name,
              evidenceDeleted: true,
            },
            items: {
              create: {
                itemId: parseInt(itemId),
              },
            },
          },
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
      if (error.message === 'Unauthorized') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      res.status(500).json({ error: 'Failed to delete item' });
    }
  }
);

// Archive claim
// POST /api/claims/:claimNumber/archive
router.post('/:claimNumber/archive', isAuthenticated, async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const { reason } = req.body;
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user.id;

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
          deletedBy: userId,
          deleteReason: reason,
        },
      });

      // Add authenticated user as contributor when they archive a claim
      await tx.claimContributor.upsert({
        where: {
          claimId_userId: {
            claimId: updatedClaim.id,
            userId,
          },
        },
        create: {
          claimId: updatedClaim.id,
          userId,
        },
        update: {}, // No update needed since we just want to ensure it exists
      });

      // Log claim archive
      await tx.activityLog.create({
        data: {
          activityType: 'CLAIM_DELETED',
          userId,
          claimId: updatedClaim.id,
          metadata: {
            reason,
            claimNumber,
          },
        },
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
router.post('/:claimNumber/unarchive', isAuthenticated, async (req, res) => {
  try {
    const { claimNumber } = req.params;
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user.id;

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

      // Add authenticated user as contributor when they unarchive a claim
      await tx.claimContributor.upsert({
        where: {
          claimId_userId: {
            claimId: updatedClaim.id,
            userId,
          },
        },
        create: {
          claimId: updatedClaim.id,
          userId,
        },
        update: {}, // No update needed since we just want to ensure it exists
      });

      // Log claim unarchive
      await tx.activityLog.create({
        data: {
          activityType: 'CLAIM_UPDATED',
          userId,
          claimId: updatedClaim.id,
          metadata: {
            action: 'unarchive',
            claimNumber,
          },
        },
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
