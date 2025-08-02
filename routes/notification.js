const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get all notifications for user
router.get('/', async (req, res) => {
  const userId = req.user.id; // assume user is authenticated
  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
  res.json(notifications);
});

// Mark one as read
router.patch('/:id/read', async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.sendStatus(200);
});

module.exports = router;