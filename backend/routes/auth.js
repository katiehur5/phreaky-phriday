const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// **1. User Registration**
router.post('/register', async (req, res) => {
  try {
    const { name, phoneNumber, email, password, classYear } = req.body;

    // Enforce Yale email
    const yaleEmailRegex = /^[a-zA-Z0-9._%+-]+@yale\.edu$/;
    if (!yaleEmailRegex.test(email)) {
      return res.status(400).json({ error: 'Email must be a Yale address.' });
    }

    // check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newUser = new User({ 
      name, 
      phoneNumber, 
      email, 
      password, 
      classYear 
    });

    // console.log('Attempting to save new user...');
    await newUser.save();
    // console.log('User saved successfully');

    const token = generateToken(newUser);
    res.status(201).json({ 
      message: 'User registered successfully!', 
      user: newUser, 
      token 
    });
  } catch (err) {
    console.error('Detailed registration error:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({ 
      error: 'Error registering user', 
      details: err.message,
      type: err.name
    });
  }
});

// **2. User Login**
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });


    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ message: 'Login successful', user, token });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// **3. Get Current User (Protected)**
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
