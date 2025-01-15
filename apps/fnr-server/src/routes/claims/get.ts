import express, { Router } from 'express';
import prisma from '../../lib/prisma';

const router: Router = express.Router();

// GET /api/claims/assigned/:employeeId
router.get('/assigned/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;

    const claims = await prisma.claim.findMany({
      ...(limit ? { take: limit } : {}),
      where: {
        handler: {
          staff: {
            employeeId,
          },
        },
      },
      select: {
        id: true,
        claimNumber: true,
        description: true,
        status: true,
        isDeleted: true,
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
        lastProgressUpdate: true,
        handler: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarColour: true,
            email: true,
            staff: {
              select: {
                id: true,
                employeeId: true,
                department: true,
                position: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(claims);
  } catch (error) {
    console.error('Error fetching assigned claims:', error);
    res.status(500).json({ error: 'Failed to fetch assigned claims' });
  }
});

// GET /api/claims
router.get('/', async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 10;
    const skip = (page - 1) * pageSize;

    const [claims, total] = await Promise.all([
      prisma.claim.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          claimNumber: true,
          description: true,
          status: true,
          isDeleted: true,
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
          lastProgressUpdate: true,
          handler: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarColour: true,
              email: true,
              staff: {
                select: {
                  id: true,
                  employeeId: true,
                  department: true,
                  position: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.claim.count(),
    ]);

    res.json({
      claims,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

// GET /api/claims/recent-views
router.get('/recent-views', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

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
            handler: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarColour: true,
                email: true,
                staff: {
                  select: {
                    id: true,
                    employeeId: true,
                    department: true,
                    position: true,
                  },
                },
              },
            },
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
        handler: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarColour: true,
            staff: {
              select: {
                id: true,
                employeeId: true,
                department: true,
                position: true,
              },
            },
          },
        },
        contributors: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatarColour: true,
                staff: {
                  select: {
                    id: true,
                    employeeId: true,
                    department: true,
                    position: true,
                  },
                },
              },
            },
          },
        },
        allocatedSuppliers: {
          select: {
            supplier: {
              select: {
                id: true,
                supplierId: true,
                company: true,
                baseUser: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatarColour: true,
                  },
                },
              },
            },
          },
        },
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
