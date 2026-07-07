const router = require('express').Router();
const orders = require('../controllers/orderController');
const { authenticate, adminOnly } = require('../middleware/auth');

// Customer
router.post('/', authenticate, orders.placeOrder);
router.get('/', authenticate, orders.getMyOrders);
router.get('/:id', authenticate, orders.getOrderById);

// Admin
router.get('/admin/all', authenticate, adminOnly, orders.getAllOrders);
router.put('/admin/:id', authenticate, adminOnly, orders.updateOrderStatus);

module.exports = router;
