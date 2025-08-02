const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const uploadRoute = require('./routes/uploadTicket');
const ticketRoute = require('./routes/updateTicket');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
// const notificationsRoute = require('./routes/notification');
const technicianRoutes = require('./routes/technician');
const http = require('http');
const { initSocket } = require('./socket');

const app = express();
const server = http.createServer(app);
initSocket(server);
// Middleware
app.use(cors()); // allow requests from frontend
app.use(express.json()); // parse incoming JSON
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', uploadRoute); // POST /api/upload
app.use('/api', ticketRoute); // PUT /api/ticket/:id/resolve
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/technicians', technicianRoutes);
// app.use('/api/notifications', notificationsRoute);
// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('✅ MongoDB connected to SmartFix');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
