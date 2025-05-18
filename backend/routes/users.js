const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/register

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, classYear } = req.body;
    
    // enforce yale email
    const yaleEmailRegex = /^[a-zA-Z0-9._%+-]+@yale\.edu$/;
    if (!yaleEmailRegex.test(email)) {
      return res.status(400).json({ message: "Email must be a Yale address." });
    }

    // check if already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = new User({ name, email: email.toLowerCase(), password, classYear, items : [] });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!', user });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error registering user', details: err.message });
  }
});

module.exports = router;
