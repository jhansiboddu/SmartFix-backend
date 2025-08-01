const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  imageUrl: String,
  issueType: String,
  status: { type: String, enum: ['Open', 'Assigned', 'Resolved'], default: 'Open' },
  assignedTechnicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
