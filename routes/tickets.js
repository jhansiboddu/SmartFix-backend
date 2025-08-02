const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Technician = require('../models/Technician');

// GET: Fetch tickets of a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const tickets = await Ticket.find({ userId });

    res.status(200).json({ tickets });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// PATCH /api/tickets/:ticketId/status
router.patch('/:ticketId/status', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!['Open', 'Assigned', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Update ticket status
    ticket.status = status;
    await ticket.save();

    // If ticket is marked Resolved, update technician
    if (status === 'Resolved' && ticket.assignedTechnicianId) {
      const technician = await Technician.findOne({ userId: ticket.assignedTechnicianId });

      if (technician) {
        technician.assignedTickets = Math.max(0, technician.assignedTickets - 1);
        technician.isAvailable = true;
        await technician.save();
      }
    }

    res.status(200).json({ message: 'Ticket status updated successfully', ticket });
  } catch (err) {
    console.error('Error updating ticket status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;