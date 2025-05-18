const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imagePath: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The user who owns this item
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model('Item', ItemSchema);
