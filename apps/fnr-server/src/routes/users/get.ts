import express, { Router } from 'express';
import prisma from '../../lib/prisma';

const router: Router = express.Router();

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
