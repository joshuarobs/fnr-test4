import express from 'express';

const router = express.Router();

// GET /api/items
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ]);
});

// POST /api/items
router.post('/', (req, res) => {
  const newItem = req.body;
  // Here you would typically save to a database
  res.status(201).json({ message: 'Item created', item: newItem });
});

// GET /api/items/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id: parseInt(id), name: `Item ${id}` });
});

export default router;
