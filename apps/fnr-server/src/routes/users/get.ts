import express, { Router } from 'express';
import prisma from '../../lib/prisma';

const router: Router = express.Router();

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
            serviceType: true,
            areas: true,
            ratings: true,
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
