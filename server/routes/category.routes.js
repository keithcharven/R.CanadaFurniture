const router = require('express').Router();
const categories = require('../controllers/categoryController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/', categories.getAll);
router.get('/:slug', categories.getBySlug);

// Admin
router.post('/', authenticate, adminOnly, categories.create);
router.put('/:id', authenticate, adminOnly, categories.update);
router.delete('/:id', authenticate, adminOnly, categories.remove);

module.exports = router;
