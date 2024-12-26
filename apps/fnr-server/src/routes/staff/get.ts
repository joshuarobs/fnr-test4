import express, { Router } from 'express';
import prisma from '../../lib/prisma';

const router: Router = express.Router();

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
