// routes/items.js
const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // Import Item model
const authenticate = require('../middleware/authenticate');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // get .jpg, .png etc.
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


// POST /api/items - Add a new item
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    // console.log('BODY:', req.body);
    // console.log('FILE:', req.file);

    const { name, description, owner, isAvailable, category, subcategory, condition, size, swapType, washInstructions, price } = req.body;
    const imagePath = `uploads/${req.file.filename}`;

    const item = new Item({ 
      name,
      description, 
      imagePath, 
      owner: req.user.id,
      isAvailable,
      category,
      subcategory,
      condition,
      size,
      swapType,
      washInstructions,
      price,
    });

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
    const items = await Item.find().populate('owner', 'name email phoneNumber'); // Populate owner details
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
    const item = await Item.findById(id).populate('owner', 'name email phoneNumber');
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    console.error('Error retrieving item:', err);
    res.status(500).json({ error: 'Error retrieving item' });
  }
});

// DELETE /api/items/:id - delete item by ID
router.delete('/:id', authenticate, async (req,res) => {
  console.log("req.user:", req.user);
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (deletedItem.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }
    res.status(200).json({ message: 'Item removed successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ error: 'Error deleting item' });
  }
});

module.exports = router;
