const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true, unique: true },
  name: String,
  contact: String,
  location: String,
  skills: [String], // e.g., ["Plumbing", "Electrical"]
  assignedTickets: { type: Number, default: 0 },
  currentStatus: { type: String, enum: ['Available', 'Busy'], default: 'Available' }
});

module.exports = mongoose.model('Technician', technicianSchema);
