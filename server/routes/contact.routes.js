const router = require('express').Router();
const contact = require('../controllers/contactController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.post('/', contact.submit);

// Admin
router.get('/admin/all', authenticate, adminOnly, contact.getAll);
router.put('/admin/:id', authenticate, adminOnly, contact.updateStatus);

module.exports = router;
