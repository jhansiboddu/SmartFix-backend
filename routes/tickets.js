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



module.exports = router;
