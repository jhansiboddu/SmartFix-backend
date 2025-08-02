const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician'); // Update path
const Ticket = require('../models/Ticket');         // Update path
const createNotification = require('../utils/createNotification');

router.post('/assign-technician', async (req, res) => {
  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      return res.status(400).json({ message: 'ticketId is required' });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.status === 'Assigned') {
      return res.status(400).json({ message: 'Technician already assigned to this ticket' });
    }

    // Match lowercase issueType directly
    const technician = await Technician.findOne({
      skill: ticket.issueType, // assuming both are lowercase like 'plumbing'
      isAvailable: true
    });

    if (!technician) {
      return res.status(404).json({ message: 'No available technician found for this issue type' });
    }

    ticket.assignedTechnicianId = technician.technicianId || technician._id;
    ticket.status = 'Assigned';
    await ticket.save({ validateBeforeSave: false });

    technician.isAvailable = false;
    technician.assignedTickets = (technician.assignedTickets || 0) + 1;
    await technician.save();
    await createNotification(
      technician._id, // or technician.userId if that's how you refer
      'New Ticket Assigned',
      `You've been assigned a new ticket for ${ticket.issueType}`,
      `/tickets/${ticket._id}` // optional link to open ticket
    );
    res.status(200).json({
      message: 'Technician assigned successfully',
      ticketId: ticket._id,
      assignedTechnicianId: technician.technicianId || technician._id,
      technicianName: technician.name
    });

  } catch (error) {
    console.error('Error in /assign-technician:', error);
    res.status(500).json({ message: 'Server error during technician assignment' });
  }
});

module.exports = router;
