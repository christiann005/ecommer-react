const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Rutas públicas (cualquiera puede ver productos)
router.get('/suggestions', productController.getSuggestions);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas de Administrador (crear, editar, borrar productos)
router.post('/', protect, admin, productController.createProduct);
router.put('/:id', protect, admin, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;
