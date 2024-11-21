import express, { Router } from 'express';
import prisma from '../../lib/prisma';

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

export default router;
