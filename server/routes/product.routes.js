const router = require('express').Router();
const products = require('../controllers/productController');
const { authenticate, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer config for product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads', 'products')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `product-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Public
router.get('/', products.getAll);
router.get('/slug/:slug', products.getBySlug);
router.get('/:id', products.getById);

const handleUpload = (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Image upload failed.' });
    }
    next();
  });
};

// Admin
router.post('/', authenticate, adminOnly, handleUpload, products.create);
router.put('/:id', authenticate, adminOnly, handleUpload, products.update);
router.post('/:id/images', authenticate, adminOnly, handleUpload, products.uploadImages);
router.delete('/:id/images/:imageId', authenticate, adminOnly, products.deleteImage);
router.delete('/:id', authenticate, adminOnly, products.remove);

module.exports = router;
