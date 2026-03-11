import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div style={{ 
        padding: '5rem 2rem', 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '1.5rem' 
      }}>
        <div style={{ backgroundColor: '#f1f5f9', padding: '2rem', borderRadius: '50%' }}>
          <ShoppingBag size={60} color="#94a3b8" />
        </div>
        <h2 style={{ fontSize: '2rem', color: '#1e293b' }}>Tu carrito está vacío</h2>
        <p style={{ color: '#64748b', maxWidth: '400px' }}>
          Parece que aún no has agregado ningún producto tecnológico a tu carrito.
        </p>
        <Link to="/productos" style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '0.8rem 2rem',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'background-color 0.2s'
        }}>
          Ir a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
        <Link to="/productos" style={{ color: '#64748b', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <ArrowLeft size={20} /> <span style={{ marginLeft: '5px' }}>Seguir comprando</span>
        </Link>
      </div>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: '#1e293b' }}>Tu Carrito</h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 350px', 
        gap: '3rem',
        alignItems: 'start'
      }}>
        {/* Lista de Productos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cart.map((item) => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              gap: '1.5rem'
            }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                backgroundColor: '#f8fafc', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                fontSize: '0.7rem'
              }}>
                Imagen
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#1e293b' }}>{item.name}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{item.category}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e293b' }}
                >
                  <Minus size={18} />
                </button>
                <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e293b' }}
                >
                  <Plus size={18} />
                </button>
              </div>

              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem', color: '#1e293b' }}>
                  ${(item.price * item.quantity).toLocaleString()}
                </p>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#ef4444', 
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.8rem',
                    padding: 0
                  }}
                >
                  <Trash2 size={16} /> Eliminar
                </button>
              </div>
            </div>
          ))}
          
          <button 
            onClick={clearCart}
            style={{ 
              alignSelf: 'flex-end', 
              background: 'none', 
              border: 'none', 
              color: '#64748b', 
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.9rem'
            }}
          >
            Vaciar carrito
          </button>
        </div>

        {/* Resumen de Compra */}
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '2rem', 
          borderRadius: '20px', 
          border: '1px solid #e2e8f0',
          position: 'sticky',
          top: '100px'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1e293b' }}>Resumen</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#64748b' }}>
            <span>Subtotal</span>
            <span>${cartTotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#64748b' }}>
            <span>Envío</span>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>Gratis</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.5rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.3rem', fontWeight: 'bold', color: '#1e293b' }}>
            <span>Total</span>
            <span>${cartTotal.toLocaleString()}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            style={{
              width: '100%',
              padding: '1.2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            Pagar Ahora
          </button>
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            Pago seguro procesado por TechStore Payments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
