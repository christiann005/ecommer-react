import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Package, Calendar, MapPin, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error("Error al cargar las órdenes", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return <div style={{ padding: '5rem', textAlign: 'center' }}>Cargando tus órdenes...</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: '5rem', textAlign: 'center' }}>
        <h2>Debes iniciar sesión para ver tus órdenes</h2>
        <Link to="/login" style={{ color: '#3b82f6' }}>Ir al Login</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Package size={28} /> Mis Órdenes
      </h2>

      {orders.length === 0 ? (
        <div style={{ backgroundColor: '#f8fafc', padding: '3rem', textAlign: 'center', borderRadius: '12px' }}>
          <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Aún no has realizado ninguna compra.</p>
          <Link to="/productos" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.8rem 1.5rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>ORDEN REALIZADA</span>
                  <span style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>ESTADO</span>
                  <span style={{ fontWeight: 'bold', color: order.status === 'Pendiente' ? '#f59e0b' : '#10b981' }}>{order.status}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>TOTAL</span>
                  <span style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}><DollarSign size={16}/> ${order.totalPrice.toLocaleString()}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>ENVÍO A</span>
                  <span style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16}/> {order.shippingAddress}</span>
                </div>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>Artículos:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.OrderItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '60px', height: '60px', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {item.Product.image_url ? (
                          <img src={item.Product.image_url} alt={item.Product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Package size={24} color="#94a3b8" />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '600', color: '#1e293b', margin: '0 0 4px 0' }}>{item.Product.name}</p>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Cantidad: {item.quantity} | Precio: ${item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
