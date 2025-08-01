const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true, unique: true },
  name: String,
  contact: String,
  location: String,
  skill: { type: String, required: true }, // Skill or expertise of the technician
  assignedTickets: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true }, // Indicates if technician is available for new ticket
});

module.exports = mongoose.model('Technician', technicianSchema);
