const socketIo = require('socket.io');
let io;

function initSocket(server) {
  io = socketIo(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      socket.join(userId);
    });
  });
}

module.exports = { initSocket, io };