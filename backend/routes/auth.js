const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' });
};

// **1. User Registration**
router.post('/register', async (req, res) => {
  try {
    const { name, phoneNumber, email, password, classYear } = req.body;
    const lowerEmail = email.toLowerCase();

    // Enforce valid email
    // const yaleEmailRegex = /^[a-zA-Z0-9._%+-]+@yale\.edu$/;
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(lowerEmail)) {
      // alert('Email must be a Yale address.');
      alert('Enter valid email.');
      return res.status(422).json({ error: 'Enter valid email.' });
    }

    // check for existing user
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const newUser = new User({ 
      name, 
      phoneNumber, 
      email: lowerEmail, 
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

// **2. User Login**
router.post('/login', async (req, res) => {
  console.log('LOGIN ROUTE HIT');
  try {
    const { email, password } = req.body;
    const lowerEmail = email.toLowerCase();
    console.log("Attempting login with:", lowerEmail);
    
    const user = await User.findOne({ email: lowerEmail });

    // console.log("Found user:", user);
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      // console.log("Password match?", match);
    }

    // if (!user || !(await bcrypt.compare(password, user.password))) {
    //   return res.status(401).json({ error: 'Invalid credentials' });
    // }
    if (!user) {
      return res.status(401).json({ error : 'Invalid email' });
    } else if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error : 'Invalid password' });
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
