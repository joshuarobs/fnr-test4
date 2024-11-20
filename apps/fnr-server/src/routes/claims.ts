import express, { Router } from 'express';
import prisma from '../lib/prisma';
import { recalculateClaimValues } from '../lib/claimHelpers';

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

// POST /api/claims/:claimNumber/items
router.post('/:claimNumber/items', async (req, res) => {
  try {
    const { claimNumber } = req.params;

    // First get the claim to ensure it exists and get its ID
    const claim = await prisma.claim.findUnique({
      where: { claimNumber },
      select: { id: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Use transaction to create item and update claim
    const result = await prisma.$transaction(async (prisma) => {
      // Create the new item with the claim's ID
      const newItem = await prisma.item.create({
        data: {
          ...req.body,
          claimId: claim.id,
        },
      });

      // Update the claim's localItemIds and itemOrder arrays
      await prisma.claim.update({
        where: { id: claim.id },
        data: {
          localItemIds: {
            push: newItem.id,
          },
          itemOrder: {
            push: newItem.id,
          },
        },
      });

      // Recalculate claim values using shared helper
      await recalculateClaimValues(claim.id);

      return newItem;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
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
      select: { id: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    const updatedClaim = await recalculateClaimValues(claim.id);

    if (!updatedClaim) {
      return res
        .status(404)
        .json({ error: 'Failed to recalculate claim values' });
    }

    res.json({
      success: true,
      totalClaimed: updatedClaim.totalClaimed,
      totalApproved: updatedClaim.totalApproved,
      totalItems: updatedClaim.totalItems,
      insuredQuotesComplete: updatedClaim.insuredQuotesComplete,
      ourQuotesComplete: updatedClaim.ourQuotesComplete,
      insuredProgressPercent: updatedClaim.insuredProgressPercent,
      ourProgressPercent: updatedClaim.ourProgressPercent,
    });
  } catch (error) {
    console.error('Error recalculating claim values:', error);
    res.status(500).json({ error: 'Failed to recalculate claim values' });
  }
});

export default router;
