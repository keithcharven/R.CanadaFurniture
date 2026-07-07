const { Cart, CartItem, Product, ProductImage } = require('../models');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { user_id: userId } });
  if (!cart) {
    cart = await Cart.create({ user_id: userId });
  }
  return cart;
};

exports.getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const items = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [{
        model: Product,
        as: 'product',
        include: [{ model: ProductImage, as: 'images', attributes: ['image_url'], limit: 1 }]
      }]
    });

    const total = items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    res.json({ cart: { id: cart.id, items, total: total.toFixed(2), itemCount: items.length } });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: 'Failed to fetch cart.' });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    
    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock.' });
    }

    const cart = await getOrCreateCart(req.user.id);
    
    let item = await CartItem.findOne({
      where: { cart_id: cart.id, product_id }
    });

    if (item) {
      item.quantity += parseInt(quantity);
      await item.save();
    } else {
      item = await CartItem.create({ cart_id: cart.id, product_id, quantity: parseInt(quantity) });
    }

    res.json({ message: 'Item added to cart.', item });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add item to cart.' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findByPk(req.params.itemId);
    
    if (!item) return res.status(404).json({ error: 'Cart item not found.' });

    if (quantity <= 0) {
      await item.destroy();
      return res.json({ message: 'Item removed from cart.' });
    }

    item.quantity = parseInt(quantity);
    await item.save();
    res.json({ message: 'Cart updated.', item });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ error: 'Failed to update cart.' });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Cart item not found.' });
    await item.destroy();
    res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: 'Failed to remove item from cart.' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (cart) {
      await CartItem.destroy({ where: { cart_id: cart.id } });
    }
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart.' });
  }
};
