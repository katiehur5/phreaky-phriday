const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const path = require('path');

const MONGO_URI = 'mongodb+srv://katiehur:Phreakyphriday22!@phreakyphriday.1hyfr.mongodb.net/?retryWrites=true&w=majority&appName=PhreakyPhriday';

const app = express();
app.use(express.json());
const allowedOrigins = [
  'http://localhost:3001',  // for local development
  'http://192.168.20.140:3001', // my local IP
  'https://phreaky-phriday.vercel.app',  // deployed frontend
  'https://phreaky-phriday-git-main-katiehur5s-projects.vercel.app/',
  'https://phreaky-phriday-5lakpvgxb-katiehur5s-projects.vercel.app/'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Use the user routes
app.use('/api/users', userRoutes);

// Use the item routes
app.use('/api/items', itemRoutes);

// Use the auth routes
app.use('/api/auth', authRoutes);

// serve files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("API is running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));