import express, { Router } from 'express';
import prisma from '../../lib/prisma';

const router: Router = express.Router();

// PATCH /api/claims/:claimNumber/description
router.patch('/:claimNumber/description', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const { description } = req.body;

    if (typeof description !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Description must be a string',
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update the claim description
      const updatedClaim = await tx.claim.update({
        where: { claimNumber },
        data: { description },
      });

      // Add user as contributor when they update the description
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

      return updatedClaim;
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to update claim description:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update claim description',
    });
  }
});

export default router;
