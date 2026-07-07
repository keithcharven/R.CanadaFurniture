const router = require('express').Router();
const admin = require('../controllers/adminController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/overview', authenticate, adminOnly, admin.getOverview);
router.get('/customers', authenticate, adminOnly, admin.getCustomers);

module.exports = router;
