import express, { Router } from 'express';
import prisma from '../../lib/prisma';

const router: Router = express.Router();

// GET /api/staff?limit=10
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50); // Default 10, max 50

    const staff = await prisma.staff.findMany({
      take: limit,
      include: {
        baseUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            avatarColour: true,
          },
        },
      },
    });

    // Format response to match existing structure
    const response = staff.map((s) => ({
      id: s.baseUser.id,
      firstName: s.baseUser.firstName,
      lastName: s.baseUser.lastName,
      email: s.baseUser.email,
      avatarColour: s.baseUser.avatarColour,
      staff: {
        employeeId: s.employeeId,
        department: s.department,
        position: s.position,
      },
    }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching all staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// GET /api/staff/:employeeId
router.get('/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;

    const staff = await prisma.staff.findUnique({
      where: { employeeId },
      include: {
        baseUser: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            avatarColour: true,
          },
        },
      },
    });

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    // Format response to match existing structure
    const response = {
      ...staff.baseUser,
      staff: {
        department: staff.department,
        employeeId: staff.employeeId,
        position: staff.position,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

export default router;
