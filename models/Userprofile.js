// models/UserProfile.js
const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true, unique: true },
  name: String,
  address: String,
  location: String,
  phone: String,
  // more fields as needed...
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
