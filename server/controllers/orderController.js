const { Order, OrderItem, Cart, CartItem, Product, ProductImage, User } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.placeOrder = async (req, res) => {
  try {
    const { shipping_address, payment_method = 'cod' } = req.body;

    if (!shipping_address) {
      return res.status(400).json({ error: 'Shipping address is required.' });
    }

    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) return res.status(400).json({ error: 'Your cart is empty.' });

    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [{ model: Product, as: 'product' }]
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' });
    }

    // Check stock and calculate total
    let totalAmount = 0;
    for (const item of cartItems) {
      if (item.product.stock_quantity < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${item.product.name}". Available: ${item.product.stock_quantity}`
        });
      }
      totalAmount += parseFloat(item.product.price) * item.quantity;
    }

    const orderNumber = 'RC-' + Date.now().toString(36).toUpperCase() + '-' + uuidv4().slice(0, 4).toUpperCase();

    const order = await Order.create({
      user_id: req.user.id,
      order_number: orderNumber,
      total_amount: totalAmount,
      shipping_address,
      payment_method,
      status: 'pending',
      payment_status: 'unpaid'
    });

    // Create order items and reduce stock
    for (const item of cartItems) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.product.price,
        subtotal: parseFloat(item.product.price) * item.quantity
      });
      await item.product.update({
        stock_quantity: item.product.stock_quantity - item.quantity
      });
    }

    // Clear cart
    await CartItem.destroy({ where: { cart_id: cart.id } });

    const fullOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem, as: 'items',
        include: [{ model: Product, as: 'product', include: [{ model: ProductImage, as: 'images', attributes: ['image_url'], limit: 1 }] }]
      }]
    });

    res.status(201).json({ message: 'Order placed successfully!', order: fullOrder });
  } catch (err) {
    console.error('Place order error:', err);
    res.status(500).json({ error: 'Failed to place order.' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: OrderItem, as: 'items',
        include: [{ model: Product, as: 'product', include: [{ model: ProductImage, as: 'images', attributes: ['image_url'], limit: 1 }] }]
      }],
      order: [['created_at', 'DESC']]
    });
    res.json({ orders });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{
        model: OrderItem, as: 'items',
        include: [{ model: Product, as: 'product', include: [{ model: ProductImage, as: 'images', attributes: ['image_url'], limit: 1 }] }]
      }]
    });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
};

// Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email'] },
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'name'] }] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
      distinct: true
    });

    res.json({
      orders: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) }
    });
  } catch (err) {
    console.error('Get all orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const { status, payment_status } = req.body;
    if (status) order.status = status;
    if (payment_status) order.payment_status = payment_status;
    await order.save();

    res.json({ message: 'Order updated.', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order.' });
  }
};
