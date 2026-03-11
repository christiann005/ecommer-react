const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');
const { sequelize } = require('./models'); // Importar desde models para incluir relaciones

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la DB
const initApp = async () => {
  try {
    await connectDB();
    // { force: false, alter: true } actualiza las tablas si hay cambios en los modelos sin borrar los datos existentes (ideal para desarrollo)
    await sequelize.sync({ alter: true }); 
    console.log('📦 Tablas y relaciones sincronizadas con PostgreSQL local con éxito');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error);
  }
};

// Rutas de la API
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

initApp();
