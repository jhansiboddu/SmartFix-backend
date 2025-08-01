const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  technicianId: String, // Custom readable ID
  name: String,
  contact: String,
  skills: [String], // e.g., ["Plumbing", "Electrical"]
  assignedTickets: { type: Number, default: 0 },
  currentStatus: { type: String, enum: ['Available', 'Busy'], default: 'Available' },
  location: String // Optional
});

module.exports = mongoose.model('Technician', technicianSchema);
