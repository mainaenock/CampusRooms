import ChatMessage from './models/chatMessageModel.js';

export default function setupChat(io) {
  io.on('connection', (socket) => {
    // Join a room for a specific listing and user
    socket.on('joinRoom', ({ listingId, userId }) => {
      socket.join(`${listingId}`);
      if (userId) {
        socket.join(`user_${userId}`);
      }
    });

    // Handle sending a message
    socket.on('chatMessage', async (data) => {
      const { listingId, sender, receiver, message } = data;
      const chatMsg = new ChatMessage({ listingId, sender, receiver, message, read: false });
      await chatMsg.save();
      // Emit to listing room (for active chat)
      io.to(`${listingId}`).emit('chatMessage', {
        listingId,
        sender,
        receiver,
        message,
        timestamp: chatMsg.timestamp
      });
      // Emit to receiver's user room (for notifications)
      io.to(`user_${receiver}`).emit('chatMessage', {
        listingId,
        sender,
        receiver,
        message,
        timestamp: chatMsg.timestamp
      });
    });
  });
}
