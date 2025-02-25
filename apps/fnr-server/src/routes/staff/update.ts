import express, { Router } from 'express';
import prisma from '../../lib/prisma';
import { AuthenticatedRequest } from '../../types/express';
import { isAdmin } from '../../middleware/auth';

const router: Router = express.Router();

// Admin-only endpoint for updating any staff member's details
router.patch(
  '/:employeeId',
  isAdmin,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { employeeId } = req.params;
      const { firstName, lastName, department, avatarColour } = req.body;

      // First find the staff member to get the baseUserId
      const existingStaff = await prisma.staff.findUnique({
        where: { employeeId },
        select: { baseUserId: true },
      });

      if (!existingStaff) {
        return res.status(404).json({ error: 'Staff member not found' });
      }

      // Update both staff and baseUser records using the found baseUserId
      const staff = await prisma.staff.update({
        where: { employeeId },
        data: {
          department,
          baseUser: {
            update: {
              where: { id: existingStaff.baseUserId },
              data: {
                firstName,
                lastName,
                avatarColour,
              },
            },
          },
        },
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
      console.error('Error updating staff details:', error);
      res.status(500).json({ error: 'Failed to update staff details' });
    }
  }
);

export default router;
