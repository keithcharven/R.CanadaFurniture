const router = require('express').Router();
const chat = require('../controllers/chatController');
const { authenticate, optionalAuth, adminOnly } = require('../middleware/auth');

// Customer / Guest
router.post('/conversations', optionalAuth, chat.getOrCreateConversation);
router.get('/conversations/:id/messages', chat.getMessages);
router.post('/conversations/:id/messages', chat.sendMessage);

// Admin
router.get('/admin/conversations', authenticate, adminOnly, chat.getAllConversations);
router.put('/admin/conversations/:id/close', authenticate, adminOnly, chat.closeConversation);

module.exports = router;
