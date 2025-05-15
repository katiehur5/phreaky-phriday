const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String }, // URL for item image
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The user who owns this item
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model('Item', ItemSchema);
