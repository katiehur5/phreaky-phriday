const mongoose = require('mongoose');

const SwapSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemRequested: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' }, // pending, accepted, declined
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Swap', SwapSchema);
