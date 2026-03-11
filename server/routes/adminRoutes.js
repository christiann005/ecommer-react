const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Solo administradores pueden ver estadísticas
router.get('/stats', protect, admin, adminController.getDashboardStats);

module.exports = router;
