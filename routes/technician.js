// === routes/tickets.js ===
const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Get all tickets assigned to a specific technician
router.get('/technician/:id', async (req, res) => {
  try {
    const technicianId = req.params.id;

    const tickets = await Ticket.find({ assignedTechnicianId: technicianId })
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (err) {
    console.error("Error fetching technician tickets:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

