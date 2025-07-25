const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  classYear: { type: String },
  // items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: [] }]

  // other contacts
  insta: { type: String },
  snapchat: { type: String },
  pinterest: { type: String },
  whatsapp: { type: String },
  residence: { type: String },
  venmo: { type: String },

  // other info
  style: { type: String },
  influencer: { type: String },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Item count
UserSchema.virtual('itemCount', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'owner',
  count: true,
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
