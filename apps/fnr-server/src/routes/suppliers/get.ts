import express, { Router } from 'express';
import prisma from '../../lib/prisma';

const router: Router = express.Router();

// GET /api/suppliers?limit=10
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50); // Default 10, max 50

    const suppliers = await prisma.supplier.findMany({
      where: {
        baseUser: {
          isActive: true,
        },
      },
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
            isActive: true,
            avatarColour: true,
          },
        },
        allocatedClaims: true,
      },
    });

    if (!suppliers) {
      return res.status(404).json({ error: 'No suppliers found' });
    }

    // Format response to match existing structure
    const response = suppliers.map((s) => ({
      id: s.id,
      firstName: s.baseUser.firstName,
      lastName: s.baseUser.lastName,
      email: s.baseUser.email,
      phone: s.baseUser.phone,
      isActive: s.baseUser.isActive,
      avatarColour: s.baseUser.avatarColour,
      role: s.baseUser.role,
      supplier: {
        supplierId: s.supplierId,
        company: s.company,
        allocatedClaims: s.allocatedClaims.length,
      },
    }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching all suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// GET /api/suppliers/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await prisma.supplier.findFirst({
      where: {
        supplierId: id,
        baseUser: {
          isActive: true,
        },
      },
      include: {
        baseUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            isActive: true,
            avatarColour: true,
          },
        },
        allocatedClaims: true,
      },
    });

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    // Format response to match existing structure
    const response = {
      id: supplier.id,
      firstName: supplier.baseUser.firstName,
      lastName: supplier.baseUser.lastName,
      email: supplier.baseUser.email,
      phone: supplier.baseUser.phone,
      isActive: supplier.baseUser.isActive,
      avatarColour: supplier.baseUser.avatarColour,
      role: supplier.baseUser.role,
      supplier: {
        supplierId: supplier.supplierId,
        company: supplier.company,
        allocatedClaims: supplier.allocatedClaims.length,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

export default router;
