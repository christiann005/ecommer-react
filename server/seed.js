const { sequelize, connectDB } = require('./config/db');
const { Product } = require('./models');

const techProducts = [
  { 
    name: "Laptop Gamer X-Pro", 
    price: 1250000, 
    category: "Computadoras",
    description: "RTX 4060, 16GB RAM, 1TB SSD. Potencia extrema para juegos y diseño.",
    stock: 15,
    image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "iPhone 15 Pro Max", 
    price: 4800000, 
    category: "Celulares",
    description: "Titanio, Chip A17 Pro, el mejor sistema de cámaras en un smartphone.",
    stock: 25,
    image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Sony WH-1000XM5", 
    price: 1200000, 
    category: "Audio",
    description: "Cancelación de ruido líder en la industria y sonido excepcional.",
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Apple Watch Ultra 2", 
    price: 3500000, 
    category: "Wearables",
    description: "El reloj de aventura más capaz y resistente. GPS de doble frecuencia.",
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1434493907317-a46b53b81846?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "iPad Pro M4", 
    price: 5200000, 
    category: "Tablets",
    description: "Increíblemente delgado. Pantalla Ultra Retina XDR y rendimiento M4.",
    stock: 20,
    image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Cámara Sony A7 IV", 
    price: 9500000, 
    category: "Cámaras",
    description: "Sensor de 33MP, enfoque automático en tiempo real y video 4K 60p.",
    stock: 12,
    image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Forzamos la sincronización para actualizar la estructura si es necesario
    await sequelize.sync({ force: true }); 
    console.log('🧹 Base de datos limpiada y tablas recreadas.');

    // Insertar productos con imágenes
    await Product.bulkCreate(techProducts);
    console.log('✅ Base de datos poblada con productos e imágenes reales.');

    process.exit();
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();
