const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración del transportador
// Nota: Para usar Gmail, necesitas crear una "Contraseña de Aplicación" en tu cuenta de Google.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 465,
  secure: true, // true para puerto 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Enviar Correo de Bienvenida
exports.sendWelcomeEmail = async (userEmail, username) => {
  try {
    await transporter.sendMail({
      from: `"TechStore 🚀" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "¡Bienvenido a TechStore! ✨",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
            <h1 style="color: #3b82f6; margin: 0;">TechStore</h1>
          </div>
          <div style="padding: 30px;">
            <h2>¡Hola, ${username}!</h2>
            <p>Gracias por unirte a la mejor comunidad tecnológica. Tu cuenta ha sido creada con éxito.</p>
            <p>Ahora puedes empezar a explorar nuestro catálogo y disfrutar de las mejores ofertas.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:5173/productos" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explorar Productos</a>
            </div>
          </div>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
            &copy; 2026 TechStore. Todos los derechos reservados.
          </div>
        </div>
      `,
    });
    console.log(`📧 Correo de bienvenida enviado a: ${userEmail}`);
  } catch (error) {
    console.error("❌ Error al enviar correo de bienvenida:", error.message);
  }
};

// Enviar Confirmación de Orden
exports.sendOrderConfirmation = async (userEmail, username, order) => {
  try {
    const itemsHtml = order.OrderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.Product.name} (x${item.quantity})</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toLocaleString()}</td>
      </tr>
    `).join('');

    await transporter.sendMail({
      from: `"TechStore 🚀" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Confirmación de Pedido #${order.id} 📦`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
            <h1 style="color: #3b82f6; margin: 0;">TechStore</h1>
          </div>
          <div style="padding: 30px;">
            <h2>¡Gracias por tu compra, ${username}!</h2>
            <p>Hemos recibido tu pedido y lo estamos procesando.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr style="background-color: #f8fafc;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e2e8f0;">Producto</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e2e8f0;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td style="padding: 10px; font-weight: bold; font-size: 1.2rem;">Total</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 1.2rem; color: #3b82f6;">$${order.totalPrice.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>

            <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
              <p style="margin: 0; font-weight: bold; color: #0369a1;">Dirección de envío:</p>
              <p style="margin: 5px 0 0 0; color: #0c4a6e;">${order.shippingAddress}</p>
            </div>

            <p style="margin-top: 20px;">Puedes ver el estado de tu pedido en cualquier momento en tu perfil.</p>
          </div>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
            &copy; 2026 TechStore. Todos los derechos reservados.
          </div>
        </div>
      `,
    });
    console.log(`📧 Confirmación de orden enviada a: ${userEmail}`);
  } catch (error) {
    console.error("❌ Error al enviar confirmación de orden:", error.message);
  }
};
