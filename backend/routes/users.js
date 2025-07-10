const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const authenticate = require('../middleware/authenticate');

// POST /api/users/register

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber, classYear } = req.body;
    const lowerEmail = email.toLowerCase();
    
    // enforce valid email
    // const yaleEmailRegex = /^[a-zA-Z0-9._%+-]+@yale\.edu$/;
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(lowerEmail)) {
      alert('Enter valid email.');
      return res.status(422).json({ error: 'Enter valid email.' });
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

// PUT /api/users/:id - Update user details
router.put('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only the owner can edit
    if (user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatableFields = [
      'name', 'email', 'phoneNumber', 'classYear',
      'insta', 'snapchat', 'pinterest', 'whatsapp', 'residence', 'venmo', 
      'style', 'influencer'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    res.status(200).json({ message: 'User updated', user });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/:id - Get user by ID and their items
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const items = await Item.find({ owner: user._id }).populate('owner', 'name email phoneNumber');

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email.toLowerCase(),
      phoneNumber: user.phoneNumber,
      classYear: user.classYear,

      insta: user.insta,
      snapchat: user.snapchat,
      pinterest: user.pinterest,
      whatsapp: user.whatsapp,
      residence: user.residence,
      venmo: user.venmo,

      style: user.style,
      influencer: user.influencer,
      
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