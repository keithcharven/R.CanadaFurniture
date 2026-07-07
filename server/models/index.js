const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  full_name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(30) },
  role: { type: DataTypes.ENUM('customer', 'admin'), defaultValue: 'customer' },
  address: { type: DataTypes.TEXT }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});



const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT }
}, {
  tableName: 'categories',
  timestamps: false
});

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category_id: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING(255), allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  material: { type: DataTypes.STRING(150) },
  dimensions: { type: DataTypes.STRING(150) },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const ProductImage = sequelize.define('ProductImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  image_url: { type: DataTypes.STRING(500), allowNull: false },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'product_images',
  timestamps: false
});

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'carts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

const CartItem = sequelize.define('CartItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cart_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, {
  tableName: 'cart_items',
  timestamps: false
});

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  order_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  status: { type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'), defaultValue: 'pending' },
  shipping_address: { type: DataTypes.TEXT, allowNull: false },
  payment_method: { type: DataTypes.ENUM('cod', 'bank_transfer', 'online'), defaultValue: 'cod' },
  payment_status: { type: DataTypes.ENUM('unpaid', 'paid', 'refunded'), defaultValue: 'unpaid' }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
  tableName: 'order_items',
  timestamps: false
});

const DesignAppointment = sequelize.define('DesignAppointment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  client_full_name: { type: DataTypes.STRING(150), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  country_code: { type: DataTypes.STRING(10), defaultValue: '+63' },
  contact_number: { type: DataTypes.STRING(30), allowNull: false },
  preferred_date: { type: DataTypes.DATEONLY },
  preferred_time: { type: DataTypes.TIME },

  project_type: { type: DataTypes.STRING(100) },
  meeting_type: { type: DataTypes.ENUM('in_store', 'online', 'at_home'), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'), defaultValue: 'pending' },
  consent_given: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'design_appointments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

const ContactMessage = sequelize.define('ContactMessage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  subject: { type: DataTypes.STRING(255) },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('new', 'read', 'resolved'), defaultValue: 'new' }
}, {
  tableName: 'contact_messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

const ChatConversation = sequelize.define('ChatConversation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  guest_name: { type: DataTypes.STRING(150) },
  guest_email: { type: DataTypes.STRING(255) },
  status: { type: DataTypes.ENUM('open', 'closed'), defaultValue: 'open' }
}, {
  tableName: 'chat_conversations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

const ChatMessage = sequelize.define('ChatMessage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  conversation_id: { type: DataTypes.INTEGER, allowNull: false },
  sender_type: { type: DataTypes.ENUM('customer', 'admin'), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: 'chat_messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// ============================================
// ASSOCIATIONS
// ============================================

// User associations
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' });
User.hasMany(DesignAppointment, { foreignKey: 'user_id', as: 'appointments' });
User.hasMany(ChatConversation, { foreignKey: 'user_id', as: 'conversations' });

// Category ↔ Product
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Product ↔ Images
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

// Cart
Cart.belongsTo(User, { foreignKey: 'user_id' });
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Order
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Design Appointments
DesignAppointment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });


// Chat
ChatConversation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
ChatConversation.hasMany(ChatMessage, { foreignKey: 'conversation_id', as: 'messages' });
ChatMessage.belongsTo(ChatConversation, { foreignKey: 'conversation_id', as: 'conversation' });

module.exports = {
  sequelize,
  User,

  Category,
  Product,
  ProductImage,
  Cart,
  CartItem,
  Order,
  OrderItem,
  DesignAppointment,
  ContactMessage,
  ChatConversation,
  ChatMessage
};
