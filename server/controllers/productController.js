const fs = require('fs');
const path = require('path');
const { Product, ProductImage, Category } = require('../models');
const { Op } = require('sequelize');

const MAX_IMAGES = 5;

const deleteImageFile = (imageUrl) => {
  if (!imageUrl) return;
  const filePath = path.join(__dirname, '..', imageUrl.replace(/^\//, ''));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

exports.getAll = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, material, sort, featured, page = 1, limit = 12 } = req.query;
    
    const where = {};
    if (category) where.category_id = category;
    if (featured === 'true') where.is_featured = true;
    if (material) where.material = { [Op.like]: `%${material}%` };
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    let order = [['created_at', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    else if (sort === 'price_desc') order = [['price', 'DESC']];
    else if (sort === 'name_asc') order = [['name', 'ASC']];
    else if (sort === 'name_desc') order = [['name', 'DESC']];
    else if (sort === 'newest') order = [['created_at', 'DESC']];

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: ProductImage, as: 'images', attributes: ['id', 'image_url', 'sort_order'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
      ],
      order,
      limit: parseInt(limit),
      offset,
      distinct: true
    });

    res.json({
      products: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: ProductImage, as: 'images', attributes: ['id', 'image_url', 'sort_order'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
      ]
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Get related products from same category
    const related = await Product.findAll({
      where: { category_id: product.category_id, id: { [Op.ne]: product.id } },
      include: [{ model: ProductImage, as: 'images', attributes: ['id', 'image_url'] }],
      limit: 4
    });

    res.json({ product, related });
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug },
      include: [
        { model: ProductImage, as: 'images', attributes: ['id', 'image_url', 'sort_order'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
      ]
    });

    if (!product) return res.status(404).json({ error: 'Product not found.' });

    const related = await Product.findAll({
      where: { category_id: product.category_id, id: { [Op.ne]: product.id } },
      include: [{ model: ProductImage, as: 'images', attributes: ['id', 'image_url'] }],
      limit: 4
    });

    res.json({ product, related });
  } catch (err) {
    console.error('Get product by slug error:', err);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
};

// Admin CRUD
exports.create = async (req, res) => {
  try {
    const { name, category_id, description, price, stock_quantity, material, dimensions, is_featured } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await Product.create({
      name, 
      slug, 
      category_id: category_id ? parseInt(category_id) : null, 
      description, 
      price: parseFloat(price) || 0, 
      stock_quantity: parseInt(stock_quantity) || 0, 
      material, 
      dimensions, 
      is_featured: (is_featured === 'true' || is_featured === true)
    });

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, i) => ({
        product_id: product.id,
        image_url: `/uploads/products/${file.filename}`,
        sort_order: i
      }));
      await ProductImage.bulkCreate(images);
    }

    const full = await Product.findByPk(product.id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: Category, as: 'category' }
      ]
    });

    res.status(201).json({ message: 'Product created.', product: full });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product.' });
  }
};

exports.update = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    const { name, category_id, description, price, stock_quantity, material, dimensions, is_featured } = req.body;
    
    if (name) {
      product.name = name;
      product.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (category_id !== undefined) product.category_id = category_id ? parseInt(category_id) : null;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock_quantity !== undefined) product.stock_quantity = parseInt(stock_quantity);
    if (material !== undefined) product.material = material;
    if (dimensions !== undefined) product.dimensions = dimensions;
    if (is_featured !== undefined) product.is_featured = (is_featured === 'true' || is_featured === true);

    await product.save();

    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, i) => ({
        product_id: product.id,
        image_url: `/uploads/products/${file.filename}`,
        sort_order: i + 100
      }));
      await ProductImage.bulkCreate(images);
    }

    const full = await Product.findByPk(product.id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: Category, as: 'category' }
      ]
    });

    res.json({ message: 'Product updated.', product: full });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: ProductImage, as: 'images' }]
    });
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    (product.images || []).forEach((img) => deleteImageFile(img.image_url));
    await product.destroy();
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
};

exports.uploadImages = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided.' });
    }

    const existingCount = await ProductImage.count({ where: { product_id: product.id } });
    if (existingCount + req.files.length > MAX_IMAGES) {
      req.files.forEach((file) => deleteImageFile(`/uploads/products/${file.filename}`));
      return res.status(400).json({ error: `Maximum ${MAX_IMAGES} images per product.` });
    }

    const images = req.files.map((file, i) => ({
      product_id: product.id,
      image_url: `/uploads/products/${file.filename}`,
      sort_order: existingCount + i
    }));
    await ProductImage.bulkCreate(images);

    const full = await Product.findByPk(product.id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: Category, as: 'category' }
      ]
    });

    res.json({ message: 'Images uploaded.', product: full });
  } catch (err) {
    console.error('Upload images error:', err);
    res.status(500).json({ error: 'Failed to upload images.' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const imageId = parseInt(req.params.imageId, 10);

    if (Number.isNaN(productId) || Number.isNaN(imageId)) {
      return res.status(400).json({ error: 'Invalid product or image ID.' });
    }

    const image = await ProductImage.findOne({
      where: { id: imageId, product_id: productId }
    });
    if (!image) return res.status(404).json({ error: 'Image not found.' });

    deleteImageFile(image.image_url);
    await image.destroy();

    const images = await ProductImage.findAll({
      where: { product_id: productId },
      order: [['sort_order', 'ASC']]
    });

    res.json({ message: 'Image deleted.', images });
  } catch (err) {
    console.error('Delete image error:', err);
    res.status(500).json({ error: 'Failed to delete image.' });
  }
};
