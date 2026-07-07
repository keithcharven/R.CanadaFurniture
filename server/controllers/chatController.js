const { ChatConversation, ChatMessage, User } = require('../models');

exports.getOrCreateConversation = async (req, res) => {
  try {
    let conversation;

    if (req.user) {
      // Logged-in user — find existing open conversation or create new
      conversation = await ChatConversation.findOne({
        where: { user_id: req.user.id, status: 'open' }
      });
      if (!conversation) {
        conversation = await ChatConversation.create({
          user_id: req.user.id,
          status: 'open'
        });
      }
    } else {
      // Guest — need guest_name and guest_email
      const { guest_name, guest_email } = req.body;
      if (!guest_name || !guest_email) {
        return res.status(400).json({ error: 'Name and email are required for guest chat.' });
      }
      conversation = await ChatConversation.create({
        guest_name,
        guest_email,
        status: 'open'
      });
    }

    const messages = await ChatMessage.findAll({
      where: { conversation_id: conversation.id },
      order: [['created_at', 'ASC']]
    });

    res.json({ conversation, messages });
  } catch (err) {
    console.error('Get conversation error:', err);
    res.status(500).json({ error: 'Failed to start conversation.' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { message, sender_type = 'customer' } = req.body;
    const { id } = req.params;

    if (!message) return res.status(400).json({ error: 'Message is required.' });

    const conversation = await ChatConversation.findByPk(id);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found.' });

    const chatMessage = await ChatMessage.create({
      conversation_id: id,
      sender_type,
      message
    });

    res.status(201).json({ message: chatMessage });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.findAll({
      where: { conversation_id: req.params.id },
      order: [['created_at', 'ASC']]
    });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
};

// Admin
exports.getAllConversations = async (req, res) => {
  try {
    const { status = 'open' } = req.query;
    const where = {};
    if (status) where.status = status;

    const conversations = await ChatConversation.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email'] },
        { model: ChatMessage, as: 'messages', limit: 1, order: [['created_at', 'DESC']] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ conversations });
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ error: 'Failed to fetch conversations.' });
  }
};

exports.closeConversation = async (req, res) => {
  try {
    const conversation = await ChatConversation.findByPk(req.params.id);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found.' });
    conversation.status = 'closed';
    await conversation.save();
    res.json({ message: 'Conversation closed.', conversation });
  } catch (err) {
    res.status(500).json({ error: 'Failed to close conversation.' });
  }
};
