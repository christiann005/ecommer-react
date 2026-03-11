const { Sequelize } = require('sequelize');
require('dotenv').config();

// Usamos la URL completa de conexión (DATABASE_URL)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  // Para conexiones locales desactivamos SSL, para Supabase/Render se suele requerir.
  dialectOptions: process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1') 
    ? {} 
    : {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Base de datos conectada con éxito (Supabase/DATABASE_URL)');
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error.message);
  }
};

module.exports = { sequelize, connectDB };
