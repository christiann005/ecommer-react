const { Review, User } = require('../models');

// Añadir una reseña
exports.addReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    // Verificar si el usuario ya dejó una reseña para este producto
    const existingReview = await Review.findOne({
      where: { userId: req.user.id, productId }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Ya has calificado este producto' });
    }

    const review = await Review.create({
      rating,
      comment,
      productId,
      userId: req.user.id
    });

    const fullReview = await Review.findByPk(review.id, {
      include: [{ model: User, attributes: ['username'] }]
    });

    res.status(201).json(fullReview);
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir la reseña', error: error.message });
  }
};

// Obtener todas las reseñas de un producto
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      include: [{ model: User, attributes: ['username'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reseñas', error: error.message });
  }
};
