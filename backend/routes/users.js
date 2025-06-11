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
      return res.status(422).json({ message: "Email must be a Yale address." });
    }

    // check if already registered
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = new User({ 
      name, 
      email: lowerEmail, 
      password, 
      phoneNumber, 
      classYear, 
      items : [] 
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!', user });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error registering user', details: err.message });
  }
});

// GET /api/users/:id - Get user by ID and their items
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const items = await Item.find({ owner: user._id });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email.toLowerCase(),
      phoneNumber: user.phoneNumber,
      classYear: user.classYear,
      items: items,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;