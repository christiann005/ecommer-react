# 🚀 TechStore - FullStack E-commerce

TechStore es una plataforma de comercio electrónico moderna construida con el stack **PERN** (PostgreSQL, Express, React, Node.js). Incluye funcionalidades avanzadas como autenticación JWT, carrito persistente, sistema de reseñas y un dashboard administrativo con gráficos en tiempo real.

## ✨ Características Principales

- **🛒 Carrito de Compras:** Sincronización automática entre el navegador y la base de datos PostgreSQL.
- **🔐 Autenticación Completa:** Registro e inicio de sesión seguro utilizando JWT y encriptación de contraseñas con bcrypt.
- **📊 Dashboard Administrativo:** Panel exclusivo para admins con métricas de ventas, gráficos de tendencias (Recharts) y gestión de inventario.
- **⭐ Reseñas y Calificaciones:** Los usuarios pueden calificar productos y dejar comentarios.
- **🔍 Buscador Predictivo:** Sugerencias inteligentes con imágenes y precios mientras escribes.
- **📱 Diseño Responsive:** Experiencia optimizada para pantalla completa y dispositivos móviles.

## 🛠️ Tecnologías Utilizadas

**Frontend:**
- React 19 + Vite
- Context API (Estado Global)
- Axios (Peticiones HTTP)
- Lucide-React (Iconos)
- Sonner (Notificaciones elegantes)
- Recharts (Visualización de datos)

**Backend:**
- Node.js & Express
- PostgreSQL (Base de datos relacional)
- Sequelize (ORM)
- JSON Web Token (Seguridad)

---

## 🚀 Instalación y Ejecución

Sigue estos pasos para poner en marcha el proyecto en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/ecommer-react.git
cd ecommer-react
```

### 2. Configuración de la Base de Datos
Asegúrate de tener **PostgreSQL** instalado y ejecutándose. Crea una base de datos llamada `ecommer`.

### 3. Configurar el Servidor (Backend)
Ve a la carpeta del servidor e instala las dependencias:
```bash
cd server
npm install
```
Crea un archivo `.env` en la carpeta `server` basado en el `.env.example`:
```env
DATABASE_URL=postgres://tu_usuario:tu_contrasena@localhost:5432/ecommer
PORT=5000
JWT_SECRET=tu_clave_secreta_super_segura
```

**Poblar la base de datos (opcional):**
Ejecuta el script de seed para cargar productos iniciales con imágenes:
```bash
node seed.js
```

### 4. Configurar el Frontend
Regresa a la raíz e instala las dependencias:
```bash
cd ..
npm install
```

### 5. Ejecución
Debes iniciar ambos procesos simultáneamente (en terminales separadas):

**Iniciar Backend:**
```bash
cd server
npm run dev
```

**Iniciar Frontend:**
```bash
# Desde la raíz de ecommer-react
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🔑 Gestión de Administradores

Para convertir a un usuario registrado en administrador, ejecuta el siguiente comando desde la carpeta `server`:
```bash
node makeAdmin.js tu_correo@ejemplo.com
```

---

## 📝 Licencia
Este proyecto fue desarrollado por **Cristian** como una solución de e-commerce profesional.
