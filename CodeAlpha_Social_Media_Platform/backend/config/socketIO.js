const socketIO = require('socket.io');

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Store online users
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);

    // User comes online
    socket.on('user_online', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('user_status_change', {
        userId,
        status: 'online',
        onlineUsers: Array.from(onlineUsers.keys()),
      });
    });

    // Send message
    socket.on('send_message', (data) => {
      const { senderId, receiverId, message, timestamp } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', {
          senderId,
          receiverId,
          message,
          timestamp,
        });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { senderId, receiverId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', { senderId });
      }
    });

    socket.on('stop_typing', (data) => {
      const { senderId, receiverId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_stop_typing', { senderId });
      }
    });

    // Notifications
    socket.on('send_notification', (data) => {
      const { userId, notification } = data;
      const userSocketId = onlineUsers.get(userId);
      if (userSocketId) {
        io.to(userSocketId).emit('receive_notification', notification);
      }
    });

    // User goes offline
    socket.on('disconnect', () => {
      let userId;
      for (const [id, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          userId = id;
          onlineUsers.delete(id);
          break;
        }
      }
      if (userId) {
        io.emit('user_status_change', {
          userId,
          status: 'offline',
          onlineUsers: Array.from(onlineUsers.keys()),
        });
      }
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initializeSocket;
