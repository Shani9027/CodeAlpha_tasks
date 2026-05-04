// Socket.io Configuration
let socket;

function initializeSocket() {
  socket = io('http://localhost:5000', {
    auth: {
      token: authToken,
    },
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    if (currentUserId) {
      socket.emit('user_online', currentUserId);
    }
  });

  socket.on('user_status_change', (data) => {
    updateUserStatus(data);
  });

  socket.on('receive_message', (data) => {
    handleIncomingMessage(data);
  });

  socket.on('user_typing', (data) => {
    showTypingIndicator(data.senderId);
  });

  socket.on('user_stop_typing', (data) => {
    hideTypingIndicator(data.senderId);
  });

  socket.on('receive_notification', (notification) => {
    addNotificationToUI(notification);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
}

function emitMessage(senderId, receiverId, message) {
  socket.emit('send_message', {
    senderId,
    receiverId,
    message,
    timestamp: new Date(),
  });
}

function emitTyping(senderId, receiverId) {
  socket.emit('typing', { senderId, receiverId });
}

function emitStopTyping(senderId, receiverId) {
  socket.emit('stop_typing', { senderId, receiverId });
}

function emitNotification(userId, notification) {
  socket.emit('send_notification', {
    userId,
    notification,
  });
}

function updateUserStatus(data) {
  // Update UI to show who's online
  console.log('User status changed:', data);
}

function handleIncomingMessage(data) {
  // Handle incoming message
  console.log('New message received:', data);
}

function showTypingIndicator(userId) {
  // Show typing indicator in UI
  console.log('User is typing:', userId);
}

function hideTypingIndicator(userId) {
  // Hide typing indicator
  console.log('User stopped typing:', userId);
}

function addNotificationToUI(notification) {
  // Add notification to the notification panel
  console.log('New notification:', notification);
}
