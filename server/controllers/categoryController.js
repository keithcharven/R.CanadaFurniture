const { Category } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.json({ categories });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ where: { slug: req.params.slug } });
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    res.json({ category });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = await Category.create({ name, slug, description });
    res.status(201).json({ message: 'Category created.', category });
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ error: 'Failed to create category.' });
  }
};

exports.update = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    const { name, description } = req.body;
    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) category.description = description;
    await category.save();
    res.json({ message: 'Category updated.', category });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    await category.destroy();
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category.' });
  }
};
