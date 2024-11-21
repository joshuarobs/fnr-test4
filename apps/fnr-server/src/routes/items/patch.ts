import express, { Router } from 'express';
import prisma from '../../lib/prisma';
import { recalculateClaimValues } from '../../lib/claimHelpers';

const router: Router = express.Router();

// PATCH /api/items/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
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
      itemStatus,
    } = req.body;

    // Build update data object with all possible fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (group !== undefined) updateData.group = group;
    if (modelSerialNumber !== undefined)
      updateData.modelSerialNumber = modelSerialNumber;
    if (description !== undefined) updateData.description = description;
    if (purchaseDate !== undefined) updateData.purchaseDate = purchaseDate;
    if (age !== undefined) updateData.age = age;
    if (condition !== undefined) updateData.condition = condition;
    if (insuredsQuote !== undefined) updateData.insuredsQuote = insuredsQuote;
    if (ourQuote !== undefined) updateData.ourQuote = ourQuote;
    if (itemStatus !== undefined) updateData.itemStatus = itemStatus;

    // Use transaction to update both item and recalculate claim values
    const result = await prisma.$transaction(async (prisma) => {
      // First update the item
      const item = await prisma.item.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      // Recalculate claim values
      await recalculateClaimValues(item.claimId);

      return item;
    });

    res.json(result);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

export default router;
