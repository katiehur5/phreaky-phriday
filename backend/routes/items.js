// routes/items.js
const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // Import Item model

// POST /api/items - Add a new item
router.post('/', async (req, res) => {
  try {
    const { name, description, imageUrl, owner } = req.body;
    const item = new Item({ name, description, imageUrl, owner });
    await item.save();
    res.status(201).json({ message: 'Item added successfully!', item });
  } catch (err) {
    console.error('Error adding item:', err);
    res.status(500).json({ error: 'Error adding item', details: err.message });
  }
});

// GET /api/items - Retrieve all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('owner', 'name email'); // Populate owner details
    res.status(200).json(items);
  } catch (err) {
    console.error('Error retrieving items:', err);
    res.status(500).json({ error: 'Error retrieving items' });
  }
});

// GET /api/items/:id - Retrieve a specific item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id).populate('owner', 'name email');
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    console.error('Error retrieving item:', err);
    res.status(500).json({ error: 'Error retrieving item' });
  }
});

module.exports = router;
