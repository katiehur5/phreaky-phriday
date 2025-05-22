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

// POST /api/items/:id/like - like an item
router.post('/:id/like', authenticate, async (req, res) => {
  const userId = req.user.id;
  const item = await Item.findById(req.params.id);

  if (!item) return res.status(404).json({ message: "Item not found" });

  const index = item.likes.indexOf(userId);
  if (index > -1) {
    item.likes.splice(index, 1); // unlike
  } else {
    item.likes.push(userId); // like
  }

  await item.save();
  res.status(200).json({ likes: item.likes.length });
});

// GET /api/items - Retrieve all items
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      swapType,
      category,
      subcategory,
      size
    } = req.query;

    const query = {};
    if (req.query.swapType) query.swapType = { $in: [].concat(req.query.swapType) };
    if (req.query.category) query.category = { $in: [].concat(req.query.category) };
    if (req.query.subcategory) query.subcategory = { $in: [].concat(req.query.subcategory) };
    if (req.query.size) query.size = { $in: [].concat(req.query.size) };

    const items = await Item.find(query)
      .populate('owner', 'name email phoneNumber')  // populate owner details
      .sort({ likes: -1 })
      .lean();  // convert to plain JS objects

    items.forEach(item => {
      item.likedByCurrentUser = item.likes.some(like => like.toString() === req.user.id)
    });
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
