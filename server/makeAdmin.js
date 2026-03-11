const { User } = require('./models');
const { connectDB } = require('./config/db');
require('dotenv').config();

const makeAdmin = async (email) => {
  if (!email) {
    console.error('❌ Por favor, proporciona un correo electrónico.');
    process.exit(1);
  }

  try {
    await connectDB();
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.error(`❌ No se encontró ningún usuario con el correo: ${email}`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ ¡Éxito! El usuario ${user.username} (${email}) ahora es ADMINISTRADOR.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar el usuario:', error.message);
    process.exit(1);
  }
};

// Obtener el correo desde los argumentos de la línea de comandos
const emailArg = process.argv[2];
makeAdmin(emailArg);
