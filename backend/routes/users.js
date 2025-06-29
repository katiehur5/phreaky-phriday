const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');

// POST /api/users/register

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber, classYear } = req.body;
    const lowerEmail = email.toLowerCase();
    
    // enforce yale email
    const yaleEmailRegex = /^[a-zA-Z0-9._%+-]+@yale\.edu$/;
    if (!yaleEmailRegex.test(lowerEmail)) {
      return res.status(422).json({ error: 'Email must be a Yale address.' });
    }

    // check if already registered
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = new User({ 
      name, 
      email: lowerEmail, 
      password, 
      phoneNumber, 
      classYear
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!', user });
  } catch (err) {
    // Check if it's a duplicate key error (MongoDB error code 11000)
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    console.error('Detailed registration error:', {
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code
    });
    
    res.status(500).json({ 
      error: 'Error registering user',
      details: err.message
    });
  }
});

// GET /api/users/:id - Get user by ID and their items
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const items = await Item.find({ owner: user._id });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email.toLowerCase(),
      phoneNumber: user.phoneNumber,
      classYear: user.classYear,
      items: items,
      itemCount: items.length,
    });
  } catch (err) {
    console.error('Error fetching user:', {
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code
    });
    
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    
    res.status(500).json({ 
      error: 'Error fetching user',
      details: err.message
    });
  }
});

module.exports = router;