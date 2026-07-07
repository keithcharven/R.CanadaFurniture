const { User, Order, Product, DesignAppointment, ContactMessage, ChatConversation } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/db');

exports.getOverview = async (req, res) => {
  try {
    const totalCustomers = await User.count({ where: { role: 'customer' } });
    const totalOrders = await Order.count();
    const pendingAppointments = await DesignAppointment.count({ where: { status: 'pending' } });
    const newMessages = await ContactMessage.count({ where: { status: 'new' } });
    const openChats = await ChatConversation.count({ where: { status: 'open' } });

    // Total sales
    const salesResult = await Order.sum('total_amount', {
      where: { status: { [Op.ne]: 'cancelled' } }
    });
    const totalSales = salesResult || 0;

    // Recent orders
    const recentOrders = await Order.findAll({
      include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    // Monthly sales (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Order.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('created_at')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('created_at')), 'year'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        created_at: { [Op.gte]: sixMonthsAgo },
        status: { [Op.ne]: 'cancelled' }
      },
      group: [sequelize.fn('MONTH', sequelize.col('created_at')), sequelize.fn('YEAR', sequelize.col('created_at'))],
      order: [[sequelize.fn('YEAR', sequelize.col('created_at')), 'ASC'], [sequelize.fn('MONTH', sequelize.col('created_at')), 'ASC']]
    });

    // Top products
    const topProducts = await Product.findAll({
      attributes: ['id', 'name', 'price'],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    res.json({
      stats: { totalSales, totalOrders, totalCustomers, pendingAppointments, newMessages, openChats },
      recentOrders,
      monthlySales,
      topProducts
    });
  } catch (err) {
    console.error('Admin overview error:', err);
    res.status(500).json({ error: 'Failed to fetch overview data.' });
  }
};

// Admin customers
exports.getCustomers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const where = { role: 'customer' };
    if (search) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      customers: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers.' });
  }
};
