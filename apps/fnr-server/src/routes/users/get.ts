import express, { Router } from 'express';
import prisma from '../../lib/prisma';
import { isAuthenticated } from '../../middleware/auth';

const router: Router = express.Router();

// GET /api/users/me - Get current user's data from session
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const [user, recentlyViewedClaims, assignedClaims] = await Promise.all([
      prisma.baseUser.findUnique({
        where: { id: req.user?.id },
        include: {
          staff: {
            select: {
              department: true,
              employeeId: true,
              position: true,
            },
          },
          insured: {
            select: {
              address: true,
            },
          },
          supplier: {
            select: {
              company: true,
            },
          },
        },
      }),
      prisma.recentlyViewedClaim.findMany({
        where: {
          userId: req.user?.id,
        },
        orderBy: {
          viewedAt: 'desc',
        },
        include: {
          claim: {
            include: {
              handler: {
                include: {
                  staff: true,
                },
              },
            },
          },
        },
      }),
      req.user?.staff?.employeeId
        ? prisma.claim.findMany({
            where: {
              handlerId: req.user.id,
              isDeleted: false,
            },
            orderBy: {
              updatedAt: 'desc',
            },
            take: 5,
            include: {
              handler: {
                include: {
                  staff: true,
                },
              },
            },
          })
        : Promise.resolve([]),
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sensitive data and combine all data
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      recentlyViewedClaims: recentlyViewedClaims.map((rv) => ({
        id: rv.id,
        claim: {
          id: rv.claim.id,
          claimNumber: rv.claim.claimNumber,
          description: rv.claim.description,
          status: rv.claim.status,
          totalClaimed: rv.claim.totalClaimed,
          totalApproved: rv.claim.totalApproved,
          createdAt: rv.claim.createdAt,
          updatedAt: rv.claim.updatedAt,
          isDeleted: rv.claim.isDeleted,
          handler: rv.claim.handler,
        },
        viewedAt: rv.viewedAt,
      })),
      assignedClaims: assignedClaims.map((claim) => ({
        id: claim.id,
        claimNumber: claim.claimNumber,
        description: claim.description,
        status: claim.status,
        totalClaimed: claim.totalClaimed,
        totalApproved: claim.totalApproved,
        createdAt: claim.createdAt,
        updatedAt: claim.updatedAt,
        isDeleted: claim.isDeleted,
        handler: claim.handler,
      })),
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Failed to fetch current user' });
  }
});

// GET /api/users/customers - Get all customer users
router.get('/customers', async (req, res) => {
  try {
    const customers = await prisma.baseUser.findMany({
      where: {
        isDeleted: false,
        role: 'INSURED',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        avatarColour: true,
        insured: {
          select: {
            address: true,
            claims: {
              where: {
                isDeleted: false,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/users/staff - Get all staff users
router.get('/staff', async (req, res) => {
  try {
    const staffUsers = await prisma.baseUser.findMany({
      where: {
        isDeleted: false,
        OR: [{ role: 'STAFF' }, { role: 'ADMIN' }],
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        avatarColour: true,
        staff: {
          select: {
            employeeId: true,
          },
        },
        handledClaims: {
          where: {
            isDeleted: false,
          },
        },
        contributedClaims: {
          where: {
            claim: {
              isDeleted: false,
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    res.json(staffUsers);
  } catch (error) {
    console.error('Error fetching staff users:', error);
    res.status(500).json({ error: 'Failed to fetch staff users' });
  }
});

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.baseUser.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        avatarColour: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.baseUser.findUnique({
      where: { id: parseInt(id) },
      include: {
        staff: {
          select: {
            department: true,
            employeeId: true,
            position: true,
          },
        },
        insured: {
          select: {
            address: true,
          },
        },
        supplier: {
          select: {
            company: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
