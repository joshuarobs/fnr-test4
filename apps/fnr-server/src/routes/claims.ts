import express, { Router } from 'express';
import prisma from '../lib/prisma';

const router: Router = express.Router();

// GET /api/claims
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const claims = await prisma.claim.findMany({
      take: limit,
      select: {
        id: true,
        claimNumber: true,
        description: true,
        status: true,
        items: {
          select: {
            id: true,
          },
        },
        totalClaimed: true,
        totalApproved: true,
        createdAt: true,
        updatedAt: true,
        insuredProgressPercent: true,
        ourProgressPercent: true,
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

// GET /api/claims/recent-views
router.get('/recent-views', async (req, res) => {
  try {
    // TODO: Get actual user ID from auth
    const userId = 1; // Temporary for testing

    const recentViews = await prisma.recentlyViewedClaim.findMany({
      where: {
        userId,
      },
      include: {
        claim: {
          select: {
            claimNumber: true,
            description: true,
            status: true,
            totalClaimed: true,
            totalApproved: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        viewedAt: 'desc',
      },
      take: 100, // Limit to last 100 viewed claims
    });

    res.json(recentViews);
  } catch (error) {
    console.error('Error fetching recent views:', error);
    res.status(500).json({ error: 'Failed to fetch recent views' });
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

// POST /api/claims/:claimNumber/view
router.post('/:claimNumber/view', async (req, res) => {
  try {
    const { claimNumber } = req.params;
    // TODO: Get actual user ID from auth
    const userId = 1; // Temporary for testing

    // Find the claim by claimNumber to get its ID
    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      select: { id: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Upsert the view record - creates new or updates existing
    await prisma.recentlyViewedClaim.upsert({
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

    res.json({ success: true });
  } catch (error) {
    console.error('Error recording claim view:', error);
    res.status(500).json({ error: 'Failed to record claim view' });
  }
});

// POST /api/claims/:claimNumber/recalculate
router.post('/:claimNumber/recalculate', async (req, res) => {
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

    // Calculate totals from items
    const totalClaimed = claim.items.reduce(
      (sum, item) => sum + (item.insuredsQuote || 0),
      0
    );
    const totalApproved = claim.items.reduce(
      (sum, item) => sum + (item.ourQuote || 0),
      0
    );

    // Calculate progress values
    const totalItems = claim.items.length;
    const insuredQuotesComplete = claim.items.filter(
      (item) => item.insuredsQuote !== null
    ).length;
    const ourQuotesComplete = claim.items.filter(
      (item) => item.ourQuote !== null
    ).length;

    const insuredProgressPercent =
      totalItems > 0 ? (insuredQuotesComplete / totalItems) * 100 : 0;
    const ourProgressPercent =
      totalItems > 0 ? (ourQuotesComplete / totalItems) * 100 : 0;

    // Update claim with all calculated values
    await prisma.claim.update({
      where: { claimNumber },
      data: {
        totalClaimed,
        totalApproved,
        totalItems,
        insuredQuotesComplete,
        ourQuotesComplete,
        insuredProgressPercent,
        ourProgressPercent,
        lastProgressUpdate: new Date(),
      },
    });

    res.json({
      success: true,
      totalClaimed,
      totalApproved,
      totalItems,
      insuredQuotesComplete,
      ourQuotesComplete,
      insuredProgressPercent,
      ourProgressPercent,
    });
  } catch (error) {
    console.error('Error recalculating claim values:', error);
    res.status(500).json({ error: 'Failed to recalculate claim values' });
  }
});

export default router;
