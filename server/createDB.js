const { Client } = require('pg');
require('dotenv').config();

const createDatabase = async () => {
  // Conectamos a 'postgres' (la DB por defecto de PostgreSQL) para poder crear la nueva DB
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456',
    port: 5432,
  });

  try {
    await client.connect();
    // Verificamos si la base de datos ya existe
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'ecommer'");
    
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE ecommer');
      console.log('✅ Base de datos "ecommer" creada con éxito.');
    } else {
      console.log('ℹ️ La base de datos "ecommer" ya existe.');
    }
  } catch (err) {
    console.error('❌ Error al crear la base de datos:', err.message);
  } finally {
    await client.end();
  }
};

createDatabase();
