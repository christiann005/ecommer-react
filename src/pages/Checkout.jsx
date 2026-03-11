import React, { useState, useContext } from 'react';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    address: '',
    city: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Por favor, inicia sesión para procesar tu pago y guardar tu orden.");
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      // Preparamos los items para el backend
      const orderItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const orderData = {
        orderItems,
        shippingAddress: `${formData.address}, ${formData.city}`,
        totalPrice: cartTotal
      };

      // Guardar la orden en la base de datos
      await axios.post('http://localhost:5000/api/orders', orderData);
      
      setIsProcessing(false);
      setIsSuccess(true);
      await clearCart(); // Vaciamos el carrito (local y en BD)
    } catch (error) {
      console.error("Error al procesar la orden", error);
      setIsProcessing(false);
      alert("Hubo un problema al procesar tu pago. Inténtalo de nuevo.");
    }
  };

  if (cart.length === 0 && !isSuccess) {
    return (
      <div style={{ padding: '5rem', textAlign: 'center' }}>
        <h2>No hay productos para pagar</h2>
        <Link to="/productos" style={{ color: '#3b82f6' }}>Volver a la tienda</Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div style={{ 
        padding: '5rem 2rem', 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '1.5rem',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{ backgroundColor: '#f0fdf4', padding: '2rem', borderRadius: '50%' }}>
          <CheckCircle size={80} color="#10b981" />
        </div>
        <h1 style={{ fontSize: '2.5rem', color: '#1e293b' }}>¡Pago Exitoso!</h1>
        <p style={{ color: '#64748b', fontSize: '1.2rem', lineHeight: '1.6' }}>
          Gracias por tu compra, <strong>{formData.fullName}</strong>. Hemos enviado el recibo de tu pedido a <strong>{formData.email}</strong> y guardado la orden en tu cuenta.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            onClick={() => navigate('/mis-ordenes')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Ver mis órdenes
          </button>
          <button 
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#1e293b',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/carrito')}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: '#64748b', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: 'pointer',
          marginBottom: '2rem',
          fontSize: '1rem'
        }}
      >
        <ArrowLeft size={20} /> Volver al carrito
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '4rem' }}>
        
        {/* Formulario de Checkout */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Sección: Información de Contacto */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: '#1e293b' }}>
              <Truck size={22} color="#3b82f6" /> Información de Envío
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="tu@email.com" 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', outlineColor: '#3b82f6' }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>Nombre Completo</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Juan Pérez" 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', outlineColor: '#3b82f6' }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>Dirección</label>
                <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Calle 123 #45-67" 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', outlineColor: '#3b82f6' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>Ciudad</label>
                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Bogotá" 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', outlineColor: '#3b82f6' }} />
              </div>
            </div>
          </section>

          {/* Sección: Información de Pago */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: '#1e293b' }}>
              <CreditCard size={22} color="#3b82f6" /> Información de Pago
            </h3>
            <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>Número de Tarjeta</label>
                <input required type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="0000 0000 0000 0000" 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>Expiración (MM/AA)</label>
                  <input required type="text" name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="12/26" 
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>CVV</label>
                  <input required type="password" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="123" 
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                </div>
              </div>
            </div>
          </section>

          <button 
            type="submit"
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '1.2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'background-color 0.2s'
            }}
          >
            {isProcessing ? (
              <> <Loader2 className="animate-spin" size={24} /> Procesando...</>
            ) : (
              `Pagar $${cartTotal.toLocaleString()}`
            )}
          </button>
        </form>

        {/* Resumen Lateral */}
        <aside style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '20px', 
          border: '1px solid #e2e8f0',
          height: 'fit-content',
          position: 'sticky',
          top: '100px'
        }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Resumen del pedido</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>{item.quantity}x {item.name}</span>
                <span style={{ fontWeight: '600' }}>${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1rem' }}>
            <span>Total a pagar</span>
            <span style={{ color: '#1e293b' }}>${cartTotal.toLocaleString()}</span>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.85rem' }}>
            <ShieldCheck size={18} /> Pago encriptado con seguridad SSL de 256 bits
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Checkout;
