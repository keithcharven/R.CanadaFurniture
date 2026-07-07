const { ContactMessage } = require('../models');

exports.submit = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    const contact = await ContactMessage.create({ name, email, subject, message, status: 'new' });
    res.status(201).json({ message: 'Message sent successfully! We\'ll get back to you soon.', contact });
  } catch (err) {
    console.error('Submit contact error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
};

// Admin
exports.getAll = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await ContactMessage.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      messages: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const msg = await ContactMessage.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found.' });
    const { status } = req.body;
    if (status) msg.status = status;
    await msg.save();
    res.json({ message: 'Message status updated.', contact: msg });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message.' });
  }
};
