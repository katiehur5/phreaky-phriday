const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  count: { type: Number, default: 1 },
  gradientId: { type: Number, default: () => Math.floor(Math.random() * 6) }
});

module.exports = mongoose.model('Tag', TagSchema);
