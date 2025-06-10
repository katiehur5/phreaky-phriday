const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');
require('dotenv').config();
const path = require('path');

// Log the MongoDB URI (with password redacted) for debugging
const MONGO_URI = process.env.MONGO_URI;

const app = express();

const allowedOrigins = [
  'http://localhost:3001',  // for local development
  'http://192.168.20.140:3001', // my local IP
  'https://phreaky-phriday.vercel.app',  // deployed frontend
  'https://phreaky-phriday-git-main-katiehur5s-projects.vercel.app',
  'https://phreaky-phriday-5lakpvgxb-katiehur5s-projects.vercel.app',
  'https://phreaky-phriday-katiehur5s-projects.vercel.app',
  'https://phreaky-phriday-pubxi4vnq-katiehur5s-projects.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
}));

app.use(express.json());

// Use the user routes
app.use('/api/users', userRoutes);

// Use the item routes
app.use('/api/items', itemRoutes);

// Use the auth routes
app.use('/api/auth', authRoutes);

// serve files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => res.send("API is running"));

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // console.log('Attempting to connect to MongoDB...');
    
    // More explicit connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4
      maxPoolSize: 10,
      minPoolSize: 5,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority'
    };

    await mongoose.connect(MONGO_URI, options);
    
    // Log connection state
    // console.log('MongoDB connection state:', mongoose.connection.readyState);
    // console.log('MongoDB Connected Successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    process.exit(1);
  }
};

// Handle MongoDB connection events
// mongoose.connection.on('connected', () => {
//   console.log('Mongoose connected to MongoDB');
// });

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

// mongoose.connection.on('disconnected', () => {
//   console.log('Mongoose disconnected from MongoDB');
// });

startServer();