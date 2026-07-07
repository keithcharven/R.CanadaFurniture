const { ChatConversation, ChatMessage } = require('../models');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Customer or admin joins a conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`chat_${conversationId}`);
      console.log(`Socket ${socket.id} joined chat_${conversationId}`);
    });

    // Admin joins the admin room to receive all new conversations
    socket.on('admin_join', () => {
      socket.join('admin_room');
      console.log(`Admin socket ${socket.id} joined admin_room`);
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { conversation_id, message, sender_type } = data;

        // Save to DB
        const chatMessage = await ChatMessage.create({
          conversation_id,
          sender_type: sender_type || 'customer',
          message
        });

        // Broadcast to the conversation room
        io.to(`chat_${conversation_id}`).emit('receive_message', {
          id: chatMessage.id,
          conversation_id,
          sender_type: chatMessage.sender_type,
          message: chatMessage.message,
          created_at: chatMessage.created_at
        });

        // Notify admins of new customer messages
        if (sender_type === 'customer') {
          io.to('admin_room').emit('new_customer_message', {
            conversation_id,
            message: chatMessage.message,
            created_at: chatMessage.created_at
          });
        }
      } catch (err) {
        console.error('Socket send_message error:', err);
        socket.emit('error', { message: 'Failed to send message.' });
      }
    });

    // New conversation notification
    socket.on('new_conversation', async (data) => {
      try {
        const { user_id, guest_name, guest_email } = data;
        const conversation = await ChatConversation.create({
          user_id: user_id || null,
          guest_name,
          guest_email,
          status: 'open'
        });

        socket.join(`chat_${conversation.id}`);
        socket.emit('conversation_created', { conversation });

        // Notify admins
        io.to('admin_room').emit('new_conversation', {
          id: conversation.id,
          guest_name,
          guest_email,
          user_id,
          status: 'open',
          created_at: conversation.created_at
        });
      } catch (err) {
        console.error('Socket new_conversation error:', err);
        socket.emit('error', { message: 'Failed to create conversation.' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
