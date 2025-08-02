// === routes/tickets.js ===
const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Technician = require('../models/Technician');
// Get all tickets assigned to a specific technician
// GET technician by userId (like TO666AE)
router.get('/:userId', async (req, res) => {
  try {
    const technician = await Technician.findOne({ userId: req.params.userId });
    if (!technician) return res.status(404).json({ message: 'Technician not found' });
    res.json(technician);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all technicians
router.get('/', async (req, res) => {
  try {
    const technicians = await Technician.find();
    res.status(200).json(technicians);
  } catch (error) {
    console.error('Error fetching technicians:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;

