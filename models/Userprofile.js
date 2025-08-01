// models/UserProfile.js
const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: String,
  location: String,
  phone: String,
  // more fields as needed...
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
