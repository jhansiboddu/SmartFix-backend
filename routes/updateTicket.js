const express = require('express');
const router = express.Router();

const Ticket = require('../models/Ticket');
const Technician = require('../models/Technician');


// Confirm assignment route
router.post('/assign', async (req, res) => {
  try {
    const { userId, issueType, imageUrl } = req.body;

    if (!userId || !issueType || !imageUrl) {
      return res.status(400).json({ message: 'userId, issueType, and imageUrl are required.' });
    }

    // Find an available technician
    const technician = await Technician.findOneAndUpdate(
      {
        skills: issueType,
        currentStatus: 'Available'
      },
      {
        $set: { currentStatus: 'Busy' },
        $inc: { assignedTickets: 1 }
      },
      { sort: { assignedTickets: 1 }, new: true }
    );

    if (!technician) {
      return res.status(404).json({ message: `No technician available for ${issueType}` });
    }

    // Create ticket
    const ticket = new Ticket({
      userId,
      imageUrl,
      issueType,
      status: 'Assigned',
      assignedTechnicianId: technician._id
    });

    await ticket.save();

    res.status(200).json({
      message: 'Technician assigned successfully',
      ticketId: ticket._id,
      technician: {
        name: technician.name,
        contact: technician.contact,
        skills: technician.skills
      }
    });

  } catch (error) {
    console.error('Assignment Error:', error);
    res.status(500).json({ message: 'Error assigning technician' });
  }
});
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
