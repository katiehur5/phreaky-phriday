const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imagePath: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The user who owns this item
  isAvailable: { type: Boolean, default: true },
  category: { 
    type: String, 
    enum: ['clothing', 'shoes', 'accessories', 'home goods', 'other'],
    required: false,
    default: undefined, 
  },
  subcategory: {
    type: String, 
    enum: ['dress', 'top', 'bottom', 'outerwear', 'other'],
    required: false,
    default: undefined,
  },
  condition: {
    type: String, 
    enum: ['new', 'good', 'poor'],
    required: false,
    default: undefined,
  },    
  size: { 
    type: String,
    required: false,
    default: undefined, 
  },                                       
  swapType: { 
    type: String, 
    enum: ['borrow me', 'take me', 'buy me'],
    required: false,
    default: undefined,
  },
  washInstructions: { 
    type: String,
    required: false,
    default: undefined,
  },
  price: { 
    type: Number,
    required: false,
    default: undefined,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }],
});

module.exports = mongoose.model('Item', ItemSchema);
