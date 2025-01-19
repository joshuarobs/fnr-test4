import express, { Router } from 'express';
import prisma from '../../lib/prisma';
import { ClaimStatus } from '@prisma/client';

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
        _count: {
          select: {
            allocatedClaims: true,
          },
        },
        allocatedClaims: {
          include: {
            claim: true,
          },
        },
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
        allocatedClaims: s.allocatedClaims.filter((ac) => !ac.claim.isDeleted)
          .length,
        archivedClaims: s.allocatedClaims.filter((ac) => ac.claim.isDeleted)
          .length,
        totalAllocatedClaims: s._count.allocatedClaims,
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
        _count: {
          select: {
            allocatedClaims: true,
          },
        },
        allocatedClaims: {
          include: {
            claim: true,
          },
        },
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
        allocatedClaims: supplier.allocatedClaims.filter(
          (ac) => !ac.claim.isDeleted
        ).length,
        archivedClaims: supplier.allocatedClaims.filter(
          (ac) => ac.claim.isDeleted
        ).length,
        totalAllocatedClaims: supplier._count.allocatedClaims,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

/**
 * GET /api/suppliers/:id/claims
 * Retrieves all claims where the specified supplier is allocated as a supplier.
 * This endpoint returns claims that the supplier is responsible for handling,
 * including claim details, items, and handler information.
 *
 * @param id - The supplier's ID to fetch claims for
 * @param limit - Optional query parameter to limit number of returned claims (default: 10, max: 50)
 * @returns Array of claims with their associated items and handler details
 */
router.get('/:id/claims', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

    const claims = await prisma.claim.findMany({
      where: {
        allocatedSuppliers: {
          some: {
            supplier: {
              supplierId: id,
            },
          },
        },
        isDeleted: false,
      },
      take: limit,
      include: {
        items: {
          select: {
            id: true,
          },
        },
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
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    if (!claims) {
      return res.status(404).json({ error: 'No claims found' });
    }

    res.json(claims);
  } catch (error) {
    console.error('Error fetching supplier claims:', error);
    res.status(500).json({ error: 'Failed to fetch supplier claims' });
  }
});

export default router;
