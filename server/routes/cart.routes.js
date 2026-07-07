const router = require('express').Router();
const cart = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, cart.getCart);
router.post('/items', authenticate, cart.addItem);
router.put('/items/:itemId', authenticate, cart.updateItem);
router.delete('/items/:itemId', authenticate, cart.removeItem);
router.delete('/', authenticate, cart.clearCart);

module.exports = router;
