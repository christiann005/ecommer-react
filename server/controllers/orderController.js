const { Order, OrderItem, Product, User } = require('../models');
const emailService = require('../utils/emailService');

// Crear una nueva orden
exports.addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No hay productos en la orden' });
    }

    // Crear la orden principal
    const order = await Order.create({
      userId: req.user.id,
      shippingAddress,
      totalPrice
    });

    // Preparar los items para insertarlos (asociando el orderId y productId)
    const itemsToInsert = orderItems.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    }));

    // Insertar los items en la base de datos
    await OrderItem.bulkCreate(itemsToInsert);

    // Devolver la orden con sus items y datos del usuario para el email
    const createdOrder = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ['email', 'username'] }
      ]
    });

    // Enviar correo de confirmación
    emailService.sendOrderConfirmation(
      createdOrder.User.email,
      createdOrder.User.username,
      createdOrder
    );

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la orden', error: error.message });
  }
};

// Obtener las órdenes del usuario logueado
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        { 
          model: OrderItem, 
          include: [{ model: Product, attributes: ['name', 'image_url'] }] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las órdenes', error: error.message });
  }
};
