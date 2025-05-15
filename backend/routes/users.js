const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/register

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, classYear } = req.body;
    const user = new User({ name, email, password, classYear, items : [] });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!', user });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error registering user', details: err.message });
  }
});

module.exports = router;
