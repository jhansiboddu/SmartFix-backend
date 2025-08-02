const Notification = require('../models/Notification');
const { io } = require('../socket');

async function createNotification(userId, title, message, link = '') {
  const notification = new Notification({ userId, title, message, link });
  await notification.save();

  // Emit via socket
  io.to(userId.toString()).emit('new_notification', notification);
}

module.exports = createNotification;