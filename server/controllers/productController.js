const { Product } = require('../models');
const { Op } = require('sequelize');

// Obtener sugerencias de búsqueda
exports.getSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);

    const products = await Product.findAll({
      where: {
        name: { [Op.iLike]: `%${q}%` }
      },
      limit: 5,
      attributes: ['id', 'name', 'price', 'image_url', 'category']
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error en sugerencias', error: error.message });
  }
};

// Obtener todos los productos...
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};

// Crear producto (ADMIN)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, image_url, stock } = req.body;
    const newProduct = await Product.create({ name, price, description, category, image_url, stock });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

// Actualizar producto (ADMIN)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const updatedProduct = await product.update(req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

// Borrar producto (ADMIN)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    await product.destroy();
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al borrar producto', error: error.message });
  }
};
