// models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  imageUrl: String,
  issueType: String,
  status: { type: String, enum: ['Open', 'Assigned', 'Resolved'], default: 'Open' },
  assignedTechnicianId: { type: String, ref: 'Technician' }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
