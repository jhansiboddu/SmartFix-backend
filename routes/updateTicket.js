const express = require('express');
const router = express.Router();

const Ticket = require('../models/Ticket');
const Technician = require('../models/Technician');

// Route: PUT /ticket/:id/resolve
router.put('/update/:id/resolve', async (req, res) => {
  try {
    const ticketId = req.params.id;

    // Find the ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Update the ticket status to "Resolved"
    await Ticket.findByIdAndUpdate(ticketId, {
      status: 'Resolved',
      updatedAt: new Date()
    });

    // Update the technician status to "Available" and decrement ticket count
    await Technician.findByIdAndUpdate(ticket.assignedTechnicianId, {
      $set: { currentStatus: 'Available' },
      $inc: { assignedTickets: -1 }
    });

    res.status(200).json({ message: 'Ticket marked as resolved and technician is now available.' });
  } catch (error) {
    console.error('Error resolving ticket:', error);
    res.status(500).json({ message: 'Server error while resolving ticket' });
  }
});

module.exports = router;
