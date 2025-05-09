import express, { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma';
import {
  calculateClaimValues,
  recalculateClaimValues,
} from '../../lib/claimHelpers';
import { isAuthenticated } from '../../middleware/auth';

const router: Router = express.Router();

// POST /api/claims - Create a new claim
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const {
      claimNumber,
      policyNumber,
      description,
      incidentDate,
      blankItems = 0,
      assignedAgent,
    } = req.body;

    // Validate required fields
    if (!claimNumber || !assignedAgent) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['claimNumber', 'assignedAgent'],
      });
    }

    const creatorId = req.user?.id;
    if (!creatorId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // For now, set insuredId same as creator since we don't have separate insured users yet
    const insuredId = creatorId;

    // Find the staff member by employee ID
    const staff = await prisma.staff.findUnique({
      where: { employeeId: assignedAgent },
      include: { baseUser: true },
    });

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    // Use transaction to create claim and blank items atomically
    const result = await prisma.$transaction(async (tx) => {
      // Create initial claim with required fields
      const claim = await tx.claim.create({
        data: {
          claimNumber,
          policyNumber,
          description,
          incidentDate: new Date(incidentDate),
          insuredId,
          creatorId,
          handlerId: staff.baseUserId,
          totalItems: parseInt(blankItems.toString()),
          localItemIds: [],
          itemOrder: [],
          // Required fields with initial values
          totalClaimed: 0,
          insuredQuotesComplete: 0,
          insuredProgressPercent: 0,
          ourQuotesComplete: 0,
          ourProgressPercent: 0,
          lastProgressUpdate: new Date(),
        },
      });

      // Recalculate claim values to ensure consistency
      await recalculateClaimValues(claim.id, tx);

      // Create blank items if specified
      const numBlankItems = parseInt(blankItems.toString());
      const itemIds = [];

      for (let i = 0; i < numBlankItems; i++) {
        const item = await tx.item.create({
          data: {
            name: '',
            quantity: 1,
            itemStatus: 'NR',
            claimId: claim.id,
          },
        });
        itemIds.push(item.id);
      }

      // Update claim with item IDs if any items were created
      if (itemIds.length > 0) {
        await tx.claim.update({
          where: { id: claim.id },
          data: {
            localItemIds: itemIds,
            itemOrder: itemIds,
          },
        });
      }

      // Add creator as first contributor
      await tx.claimContributor.create({
        data: {
          claimId: claim.id,
          userId: creatorId,
        },
      });

      // Log claim creation
      await tx.activityLog.create({
        data: {
          activityType: 'CLAIM_CREATED',
          userId: creatorId,
          claimId: claim.id,
          metadata: {
            claimNumber,
            policyNumber,
            handlerId: staff.baseUserId,
            totalItems: parseInt(blankItems.toString()),
          },
        },
      });

      return claim;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating claim:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Claim number already exists' });
    }
    res.status(500).json({ error: 'Failed to create claim' });
  }
});

// Validation middleware
const validateItemRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Item name is required' });
  }
  next();
};

// POST /api/claims/:claimNumber/items
router.post(
  '/:claimNumber/items',
  isAuthenticated,
  validateItemRequest,
  async (req, res) => {
    try {
      const { claimNumber } = req.params;
      console.log('Creating item for claim:', claimNumber);

      // Use a single transaction for all operations
      const result = await prisma.$transaction(async (tx) => {
        // Get claim with existing items for calculation
        const claim = await tx.claim.findUnique({
          where: { claimNumber },
          select: {
            id: true,
            localItemIds: true,
            itemOrder: true,
            isDeleted: true,
            items: {
              select: {
                insuredsQuote: true,
                ourQuote: true,
                quantity: true,
              },
            },
          },
        });

        if (!claim) {
          throw new Error('Claim not found');
        }

        if (claim.isDeleted) {
          throw new Error('Cannot modify archived claim');
        }

        // Create the new item
        const newItem = await tx.item.create({
          data: {
            name: req.body.name.trim(),
            category: req.body.category || null,
            roomCategory: req.body.roomCategory || null,
            group: req.body.group || null,
            modelSerialNumber: req.body.modelSerialNumber || null,
            description: req.body.description || null,
            quantity: req.body.quantity || 1,
            purchaseDate: req.body.purchaseDate
              ? new Date(req.body.purchaseDate)
              : null,
            age: req.body.age || null,
            condition: req.body.condition || null,
            insuredsQuote: req.body.insuredsQuote || null,
            ourQuote: req.body.ourQuote || null,
            ourQuoteProof: req.body.ourQuoteProof || null,
            itemStatus: req.body.itemStatus || 'NR',
            claimId: claim.id,
          },
        });

        // Calculate new totals including the new item
        const allItems = [
          ...claim.items,
          {
            insuredsQuote: newItem.insuredsQuote,
            ourQuote: newItem.ourQuote,
            quantity: newItem.quantity,
          },
        ];

        const values = calculateClaimValues(allItems);

        // Update claim with new item and calculated values in one operation
        await tx.claim.update({
          where: { id: claim.id },
          data: {
            localItemIds: { set: [...(claim.localItemIds || []), newItem.id] },
            itemOrder: { set: [...(claim.itemOrder || []), newItem.id] },
            ...values,
          },
        });

        // Add user as contributor when they add an item
        const userId = req.user?.id;
        if (!userId) {
          throw new Error('Unauthorized');
        }
        await tx.claimContributor.upsert({
          where: {
            claimId_userId: {
              claimId: claim.id,
              userId,
            },
          },
          create: {
            claimId: claim.id,
            userId,
          },
          update: {}, // No update needed since we just want to ensure it exists
        });

        // Log item creation
        await tx.activityLog.create({
          data: {
            activityType: 'ITEM_CREATED',
            userId,
            claimId: claim.id,
            metadata: {
              itemName: req.body.name,
              category: req.body.category,
              roomCategory: req.body.roomCategory,
              group: req.body.group,
              modelSerialNumber: req.body.modelSerialNumber,
              description: req.body.description,
              quantity: req.body.quantity,
              purchaseDate: req.body.purchaseDate,
              age: req.body.age,
              condition: req.body.condition,
              insuredsQuote: req.body.insuredsQuote,
              ourQuote: req.body.ourQuote,
              itemStatus: req.body.itemStatus,
            },
            items: {
              create: {
                itemId: newItem.id,
              },
            },
          },
        });

        return newItem;
      });

      res.status(201).json(result);
    } catch (error) {
      console.error('Detailed error creating item:', error);
      if (error.message === 'Claim not found') {
        return res.status(404).json({ error: 'Claim not found' });
      }
      res
        .status(500)
        .json({ error: 'Failed to create item', details: error.message });
    }
  }
);

// PATCH /api/claims/:claimNumber/items/:itemId
router.patch(
  '/:claimNumber/items/:itemId',
  isAuthenticated,
  async (req, res) => {
    try {
      const { claimNumber, itemId } = req.params;
      const {
        name,
        category,
        group,
        modelSerialNumber,
        description,
        purchaseDate,
        age,
        condition,
        insuredsQuote,
        ourQuote,
        ourQuoteProof,
        itemStatus,
        roomCategory,
        quantity,
      } = req.body;

      const result = await prisma.$transaction(async (tx) => {
        // First verify the claim exists and the item belongs to it
        const claim = await tx.claim.findUnique({
          where: { claimNumber },
          include: {
            items: {
              where: { id: parseInt(itemId) },
            },
          },
        });

        if (!claim) {
          throw new Error('Claim not found');
        }

        if (claim.isDeleted) {
          throw new Error('Cannot modify archived claim');
        }

        if (claim.items.length === 0) {
          throw new Error('Item not found in claim');
        }

        // Build update data object with all possible fields
        const updateData: any = {};
        if (name !== undefined) updateData.name = name.trim();
        if (category !== undefined) updateData.category = category;
        if (group !== undefined) updateData.group = group;
        if (modelSerialNumber !== undefined)
          updateData.modelSerialNumber = modelSerialNumber;
        if (description !== undefined) updateData.description = description;
        if (purchaseDate !== undefined) updateData.purchaseDate = purchaseDate;
        if (age !== undefined) updateData.age = age;
        if (condition !== undefined) updateData.condition = condition;
        if (insuredsQuote !== undefined)
          updateData.insuredsQuote = insuredsQuote;
        if (ourQuote !== undefined) updateData.ourQuote = ourQuote;
        if (ourQuoteProof !== undefined)
          updateData.ourQuoteProof = ourQuoteProof;
        if (itemStatus !== undefined) updateData.itemStatus = itemStatus;
        if (roomCategory !== undefined) updateData.roomCategory = roomCategory;
        if (quantity !== undefined) updateData.quantity = quantity;

        // Update the item
        const updatedItem = await tx.item.update({
          where: { id: parseInt(itemId) },
          data: updateData,
        });

        // Get all items with the updated item for recalculation
        const allItems = await tx.item.findMany({
          where: { claimId: claim.id },
          select: {
            insuredsQuote: true,
            ourQuote: true,
            quantity: true,
          },
        });

        // Recalculate claim values with updated items
        const values = calculateClaimValues(allItems);

        // Update claim with calculated values
        await tx.claim.update({
          where: { id: claim.id },
          data: values,
        });

        // Add user as contributor when they update an item
        const userId = req.user?.id;
        if (!userId) {
          throw new Error('Unauthorized');
        }
        await tx.claimContributor.upsert({
          where: {
            claimId_userId: {
              claimId: claim.id,
              userId,
            },
          },
          create: {
            claimId: claim.id,
            userId,
          },
          update: {}, // No update needed since we just want to ensure it exists
        });

        // Compare old and new values to determine actual changes
        const oldItem = claim.items[0];
        const actualChanges: Record<string, any> = {};
        const changedFields: string[] = [];

        Object.entries(updateData).forEach(([key, newValue]) => {
          const oldValue = oldItem[key];
          if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            actualChanges[key] = newValue;
            changedFields.push(key);
          }
        });

        // Only log if there were actual changes
        if (changedFields.length > 0) {
          await tx.activityLog.create({
            data: {
              activityType: 'ITEM_UPDATED',
              userId,
              claimId: claim.id,
              metadata: {
                changedFields,
                changes: actualChanges,
                itemName: updateData.name || oldItem.name,
              },
              items: {
                create: {
                  itemId: parseInt(itemId),
                },
              },
            },
          });
        }

        return updatedItem;
      });

      res.json(result);
    } catch (error) {
      console.error('Error updating item:', error);
      if (error.message === 'Claim not found') {
        return res.status(404).json({ error: 'Claim not found' });
      }
      if (error.message === 'Item not found in claim') {
        return res.status(404).json({ error: 'Item not found in claim' });
      }
      res.status(500).json({ error: 'Failed to update item' });
    }
  }
);

// POST /api/claims/:claimNumber/view
router.post('/:claimNumber/view', isAuthenticated, async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const claim = await tx.claim.findUnique({
        where: { claimNumber },
        select: { id: true },
      });

      if (!claim) {
        throw new Error('Claim not found');
      }

      // Get current count of user's recently viewed claims
      const viewCount = await tx.recentlyViewedClaim.count({
        where: {
          userId,
          isDeleted: false,
        },
      });

      // If at or above limit, delete oldest view(s)
      if (viewCount >= 50) {
        const oldestViews = await tx.recentlyViewedClaim.findMany({
          where: {
            userId,
            isDeleted: false,
          },
          orderBy: {
            viewedAt: 'asc',
          },
          take: viewCount - 49, // Delete enough to get down to 49 (making room for new one)
        });

        if (oldestViews.length > 0) {
          await tx.recentlyViewedClaim.updateMany({
            where: {
              id: {
                in: oldestViews.map((view) => view.id),
              },
            },
            data: {
              isDeleted: true,
              deletedAt: new Date(),
            },
          });
        }
      }

      // Create or update the view
      return tx.recentlyViewedClaim.upsert({
        where: {
          userId_claimId: {
            userId,
            claimId: claim.id,
          },
        },
        update: {
          viewedAt: new Date(),
          isDeleted: false,
          deletedAt: null,
        },
        create: {
          userId,
          claimId: claim.id,
        },
      });
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error recording claim view:', error);
    if (error.message === 'Claim not found') {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.status(500).json({ error: 'Failed to record claim view' });
  }
});

// POST /api/claims/:claimNumber/reassign
router.post('/:claimNumber/reassign', isAuthenticated, async (req, res) => {
  try {
    const { claimNumber } = req.params;
    const { employeeId } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // If employeeId is null, unassign the claim
      if (!employeeId) {
        const updatedClaim = await tx.claim.update({
          where: { claimNumber },
          data: { handlerId: null },
          include: {
            handler: {
              include: {
                staff: true,
              },
            },
          },
        });
        return updatedClaim;
      }

      // Otherwise find the staff member and assign them
      const staff = await tx.staff.findUnique({
        where: { employeeId },
        include: { baseUser: true },
      });

      if (!staff) {
        throw new Error('Staff member not found');
      }

      // Update the claim with the new handler
      const updatedClaim = await tx.claim.update({
        where: { claimNumber },
        data: { handlerId: staff.baseUserId },
        include: {
          handler: {
            include: {
              staff: true,
            },
          },
        },
      });

      // Add user as contributor when they reassign a claim
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }
      await tx.claimContributor.upsert({
        where: {
          claimId_userId: {
            claimId: updatedClaim.id,
            userId,
          },
        },
        create: {
          claimId: updatedClaim.id,
          userId,
        },
        update: {}, // No update needed since we just want to ensure it exists
      });

      // Log handler assignment
      await tx.activityLog.create({
        data: {
          activityType: 'CLAIM_HANDLER_ASSIGNED',
          userId,
          claimId: updatedClaim.id,
          metadata: {
            oldHandlerId: updatedClaim.handlerId,
            newHandlerId: employeeId ? staff?.baseUserId : null,
          },
        },
      });

      return updatedClaim;
    });

    res.json({
      success: true,
      handler: result.handler,
    });
  } catch (error) {
    console.error('Error reassigning claim:', error);
    if (error.message === 'Staff member not found') {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.status(500).json({ error: 'Failed to reassign claim' });
  }
});

// POST /api/claims/:claimNumber/recalculate
router.post('/:claimNumber/recalculate', isAuthenticated, async (req, res) => {
  try {
    const { claimNumber } = req.params;

    const result = await prisma.$transaction(async (tx) => {
      const claim = await tx.claim.findUnique({
        where: { claimNumber },
        include: {
          items: {
            select: {
              insuredsQuote: true,
              ourQuote: true,
              quantity: true,
            },
          },
        },
      });

      if (!claim) {
        throw new Error('Claim not found');
      }

      const values = calculateClaimValues(claim.items);

      return tx.claim.update({
        where: { id: claim.id },
        data: values,
      });
    });

    res.json({
      success: true,
      totalClaimed: result.totalClaimed,
      totalApproved: result.totalApproved,
      totalItems: result.totalItems,
      insuredQuotesComplete: result.insuredQuotesComplete,
      ourQuotesComplete: result.ourQuotesComplete,
      insuredProgressPercent: result.insuredProgressPercent,
      ourProgressPercent: result.ourProgressPercent,
      lastProgressUpdate: result.lastProgressUpdate,
    });
  } catch (error) {
    console.error('Error recalculating claim values:', error);
    if (error.message === 'Claim not found') {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.status(500).json({ error: 'Failed to recalculate claim values' });
  }
});

export default router;
