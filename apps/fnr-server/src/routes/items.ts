import express, { Router } from 'express';
import prisma from '../lib/prisma';

const router: Router = express.Router();

// GET /api/items
router.get('/', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// POST /api/items
router.post('/', async (req, res) => {
  try {
    // Create the new item
    const newItem = await prisma.item.create({
      data: req.body,
    });

    // Update the claim's localItemIds array
    await prisma.claim.update({
      where: { id: req.body.claimId },
      data: {
        localItemIds: {
          push: newItem.id,
        },
        itemOrder: {
          push: newItem.id,
        },
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

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

    // Use transaction to update both item and parent claim
    const updatedItem = await prisma.$transaction(async (prisma) => {
      // First update the item
      const item = await prisma.item.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      // Then explicitly update the claim's updatedAt
      await prisma.claim.update({
        where: { id: item.claimId },
        data: {
          updatedAt: new Date(),
        },
      });

      return item;
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

export default router;
