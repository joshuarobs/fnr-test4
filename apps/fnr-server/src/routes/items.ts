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
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

export default router;
