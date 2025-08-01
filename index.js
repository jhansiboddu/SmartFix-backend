const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const uploadRoute = require('./routes/uploadTicket');
const ticketRoute = require('./routes/updateTicket');

const app = express();

// Middleware
app.use(cors()); // allow requests from frontend
app.use(express.json()); // parse incoming JSON
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve image files

// Routes
app.use('/api', uploadRoute); // POST /api/upload
app.use('/api', ticketRoute); // PUT /api/ticket/:id/resolve

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('✅ MongoDB connected to SmartFix');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
