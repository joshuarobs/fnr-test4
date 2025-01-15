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

    console.log('Updating claim description:', { claimNumber, description });
    const updatedClaim = await prisma.claim.update({
      where: { claimNumber },
      data: { description },
    });
    console.log('Successfully updated claim:', updatedClaim);

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
