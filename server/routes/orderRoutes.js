const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Rutas protegidas (solo usuarios logueados pueden crear o ver sus órdenes)
router.post('/', protect, orderController.addOrderItems);
router.get('/myorders', protect, orderController.getMyOrders);

module.exports = router;
