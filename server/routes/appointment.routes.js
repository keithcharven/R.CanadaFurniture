const router = require('express').Router();
const appointments = require('../controllers/appointmentController');
const { authenticate, optionalAuth, adminOnly } = require('../middleware/auth');

// Public (with optional auth to link user)
router.post('/', optionalAuth, appointments.create);

// Customer
router.get('/my', authenticate, appointments.getMyAppointments);

// Admin
router.get('/admin/all', authenticate, adminOnly, appointments.getAll);
router.put('/admin/:id', authenticate, adminOnly, appointments.updateStatus);

module.exports = router;
