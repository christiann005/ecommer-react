const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Obtener reseñas es público
router.get('/:productId', reviewController.getProductReviews);

// Crear reseña es privado (solo usuarios logueados)
router.post('/', protect, reviewController.addReview);

module.exports = router;
