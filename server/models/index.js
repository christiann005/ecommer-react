const { sequelize } = require('../config/db');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Review = require('./Review');

// Relaciones Usuario - Órdenes (1 a N)
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Relaciones Orden - Items (1 a N)
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Relaciones Producto - Items de Orden (1 a N)
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// Relaciones Usuario - Carrito (1 a 1)
User.hasOne(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// Relaciones Carrito - Items de Carrito (1 a N)
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

// Relaciones Producto - Items de Carrito (1 a N)
Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

// Relaciones Usuario - Reseñas (1 a N)
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

// Relaciones Producto - Reseñas (1 a N)
Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Review
};
