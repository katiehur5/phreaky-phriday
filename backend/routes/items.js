// routes/items.js
const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // Import Item model
const authenticate = require('../middleware/authenticate');
const path = require('path');
const multer = require('multer');

const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

// POST /api/items - Add a new item
router.post('/', authenticate, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'additionalImages', maxCount: 3 }
]), async (req, res) => {
  try {
    const { name, description, owner, isAvailable, category, subcategory, condition, size, swapType, washInstructions, price, tags } = req.body;
    const mainImage = req.files['image']?.[0]?.path;
    const additionalImages = (req.files['additionalImages'] || []).map(file => file.path);

    console.log("Attempting item upload by:", owner);

    // Parse tags if they come as a string (from FormData)
    let parsedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          // If not JSON, treat as comma-separated string
          parsedTags = tags.split(',').map(t => t.trim()).filter(t => t);
        }
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    }

    const item = new Item({ 
      name,
      description, 
      imagePath: mainImage, 
      additionalImages,
      owner: req.user.id,
      isAvailable,
      category,
      subcategory,
      condition,
      size,
      swapType,
      washInstructions,
      price,
      tags: parsedTags,
    });

    await item.save();
    console.log("Item added by:", owner);
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
  // res.json({ item });
  res.status(200).json({ item, likes: item.likes.length });
});

// GET /api/items - Retrieve all items
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      swapType,
      category,
      subcategory,
      size,
      tags
    } = req.query;

    const query = {};
    if (req.query.swapType) query.swapType = { $in: [].concat(req.query.swapType) };
    if (req.query.category) query.category = { $in: [].concat(req.query.category) };
    if (req.query.subcategory) query.subcategory = { $in: [].concat(req.query.subcategory) };
    if (req.query.size) query.size = { $in: [].concat(req.query.size) };
    if (req.query.tags) {
      const tagArray = [].concat(req.query.tags);
      query.tags = { $in: tagArray };
    }

    const items = await Item.find(query)
      .populate('owner', 'name email phoneNumber')  // populate owner details
      .sort({ likes: -1 })
      .lean();  // convert to plain JS objects

    items.forEach(item => {
      item.likedByCurrentUser = item.likes.some(like => like.toString() === req.user.id)
    });

    // Get all unique tags from all items for filter options
    const allTags = await Item.distinct('tags');
    
    res.status(200).json({ items, allTags: allTags.filter(t => t) });
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

// PUT /api/items/:id/toggle-availability - mark item availability by ID
router.put('/:id/toggle-availability', authenticate, async (req, res) => {

  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Optional: only allow owner to change
    if (item.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();
    res.status(200).json({ message: 'Availability updated', isAvailable: item.isAvailable });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// PUT /api/items/:id - Update item details
router.put('/:id', authenticate, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'additionalImages', maxCount: 3 }
]), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Only the owner can edit
    if (item.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatableFields = [
      'name', 'description', 'category', 'subcategory',
      'condition', 'size', 'swapType', 'washInstructions', 'price'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    // Handle tags separately since they come as JSON string from FormData
    if (req.body.tags !== undefined) {
      let parsedTags = [];
      if (typeof req.body.tags === 'string') {
        try {
          parsedTags = JSON.parse(req.body.tags);
        } catch (e) {
          // If not JSON, treat as comma-separated string
          parsedTags = req.body.tags.split(',').map(t => t.trim()).filter(t => t);
        }
      } else if (Array.isArray(req.body.tags)) {
        parsedTags = req.body.tags;
      }
      item.tags = parsedTags;
    }

    // Handle images
    if (req.files['image']) {
      item.imagePath = req.files['image'][0].path;
    }

    if (req.files['additionalImages']) {
      item.additionalImages = req.files['additionalImages'].map(file => file.path);
    }

    await item.save();
    res.status(200).json({ message: 'Item updated', item });

  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
