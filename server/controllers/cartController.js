const { Cart, CartItem, Product } = require('../models');

// Obtener o crear el carrito del usuario
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{ model: CartItem, include: [Product] }]
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
  }
};

// Sincronizar el carrito entero desde el frontend
exports.syncCart = async (req, res) => {
  try {
    const { items } = req.body; // Array de { productId, quantity }
    
    // Obtener o crear el carrito
    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    // Borramos los items actuales para reemplazarlos (estrategia simple de sincronización)
    await CartItem.destroy({ where: { cartId: cart.id } });

    // Insertar los nuevos items
    if (items && items.length > 0) {
      const itemsToInsert = items.map(item => ({
        cartId: cart.id,
        productId: item.id || item.productId,
        quantity: item.quantity
      }));
      await CartItem.bulkCreate(itemsToInsert);
    }

    const updatedCart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{ model: CartItem, include: [Product] }]
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al sincronizar el carrito', error: error.message });
  }
};

// Vaciar el carrito (por ejemplo, después de una compra)
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
    }
    res.json({ message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al vaciar el carrito', error: error.message });
  }
};
