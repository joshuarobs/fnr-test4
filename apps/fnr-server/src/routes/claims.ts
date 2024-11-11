import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// GET /api/claims
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const claims = await prisma.claim.findMany({
      take: limit,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(claims);
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

// GET /api/claims/:claimNumber
router.get('/:claimNumber', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      include: {
        items: true,
      },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    res.json(claim);
  } catch (error) {
    console.error('Error fetching claim:', error);
    res.status(500).json({ error: 'Failed to fetch claim' });
  }
});

export default router;
