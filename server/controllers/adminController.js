const { Order, User, Product, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total de Ventas ($)
    const totalSales = await Order.sum('totalPrice') || 0;

    // 2. Número de Pedidos
    const totalOrders = await Order.count();

    // 3. Total de Usuarios
    const totalUsers = await User.count({ where: { role: 'customer' } });

    // 4. Total de Productos
    const totalProducts = await Product.count();

    // 5. Datos para el Gráfico (Ventas por día de los últimos 7 días)
    const salesByDay = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('totalPrice')), 'total']
      ],
      where: {
        createdAt: {
          [Op.gte]: sequelize.literal("NOW() - INTERVAL '7 days'")
        }
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    // 6. Últimos Pedidos
    const latestOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['username', 'email'] }]
    });

    res.json({
      metrics: {
        totalSales,
        totalOrders,
        totalUsers,
        totalProducts
      },
      salesByDay,
      latestOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};
