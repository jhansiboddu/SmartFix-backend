const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const Technician = require('../models/Technician');
const Ticket = require('../models/Ticket');

// Multer config to store files in /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure 'uploads/' folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Route: POST /upload
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const userId = req.body.userId; // Must be passed from frontend

    if (!imagePath || !userId) {
      return res.status(400).json({ message: 'Image and userId are required.' });
    }

    // Send image to FastAPI
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath));

    const fastApiResponse = await axios.post(
      'http://localhost:8000/predict', // Your FastAPI endpoint
      formData,
      { headers: formData.getHeaders() }
    );

    const issueType = fastApiResponse.data.issue_type;

    // Find an available technician with the predicted skill
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

    // Create new ticket
    const ticket = new Ticket({
      userId,
      imageUrl: imagePath,
      issueType,
      status: 'Assigned',
      assignedTechnicianId: technician._id
    });

    await ticket.save();

    res.status(200).json({
      message: 'Ticket created and technician assigned successfully.',
      ticketId: ticket._id,
      technician: {
        name: technician.name,
        contact: technician.contact,
        skills: technician.skills
      }
    });

  } catch (error) {
    console.error('Error in /upload:', error);
    res.status(500).json({ message: 'Server error while handling upload.' });
  }
});

module.exports = router;
