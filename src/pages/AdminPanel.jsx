import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Shield, Trash2, Plus, DollarSign, ShoppingBag, Users, Package, TrendingUp, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Estados
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', description: '', category: '', image_url: '', stock: 10
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/admin/stats')
      ]);
      setProducts(prodRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error al cargar datos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/products', newProduct);
      setProducts([...products, data]);
      setShowAddForm(false);
      setNewProduct({ name: '', price: '', description: '', category: '', image_url: '', stock: 10 });
    } catch (error) {
      alert('Error al crear el producto');
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Loader2 className="animate-spin" size={50} color="#3b82f6" /></div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* CABECERA PANEL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontSize: '2.5rem', color: '#1e293b' }}>
            <Shield size={40} color="#fbbf24" fill="#fbbf24" /> Dashboard Admin
          </h1>
          <p style={{ color: '#64748b', marginTop: '5px' }}>Bienvenido de nuevo, gestiona tu tienda y analiza tus ventas.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e293b', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#334155'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
        >
          {showAddForm ? 'Cerrar Formulario' : <><Plus size={20} /> Añadir Producto</>}
        </button>
      </div>

      {/* METRICAS CLAVE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <MetricCard title="Ventas Totales" value={`$${stats?.metrics.totalSales.toLocaleString()}`} icon={<DollarSign color="#10b981" />} color="#dcfce7" />
        <MetricCard title="Órdenes" value={stats?.metrics.totalOrders} icon={<ShoppingBag color="#3b82f6" />} color="#dbeafe" />
        <MetricCard title="Clientes" value={stats?.metrics.totalUsers} icon={<Users color="#8b5cf6" />} color="#f3e8ff" />
        <MetricCard title="Productos" value={stats?.metrics.totalProducts} icon={<Package color="#f59e0b" />} color="#fef3c7" />
      </div>

      {/* GRÁFICO Y ÚLTIMAS ÓRDENES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', marginBottom: '4rem' }}>
        
        {/* Gráfico de Ventas */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={20} color="#3b82f6" /> Ventas de los últimos 7 días
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.salesByDay}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Ventas']}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimas Órdenes */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Pedidos Recientes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats?.latestOrders.map(order => (
              <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>{order.User.username}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>${order.totalPrice.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GESTIÓN DE PRODUCTOS */}
      {showAddForm && (
        <form onSubmit={handleAddProduct} style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '24px', marginBottom: '3rem', border: '2px dashed #cbd5e1', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          <div style={{ gridColumn: 'span 2' }}><h3 style={{ margin: 0 }}>Crear Nuevo Producto</h3></div>
          <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Nombre del Producto</label><input required type="text" name="name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0' }} /></div>
          <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Categoría</label><input required type="text" name="category" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0' }} /></div>
          <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Precio ($)</label><input required type="number" name="price" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0' }} /></div>
          <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Stock Inicial</label><input required type="number" name="stock" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0' }} /></div>
          <div style={{ gridColumn: 'span 2' }}><label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>URL de Imagen</label><input type="text" name="image_url" value={newProduct.image_url} onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0' }} /></div>
          <div style={{ gridColumn: 'span 2' }}><label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Descripción</label><textarea required name="description" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} rows="3" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', resize: 'none' }} /></div>
          <button type="submit" style={{ gridColumn: 'span 2', padding: '1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>Guardar Producto en Catálogo</button>
        </form>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '1.5rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>PRODUCTO</th>
              <th style={{ padding: '1.5rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>CATEGORÍA</th>
              <th style={{ padding: '1.5rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>PRECIO</th>
              <th style={{ padding: '1.5rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>STOCK</th>
              <th style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={product.image_url} alt="" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '10px' }} />
                  <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{product.name}</span>
                </td>
                <td style={{ padding: '1.5rem' }}><span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '50px', fontSize: '0.85rem' }}>{product.category}</span></td>
                <td style={{ padding: '1.5rem', fontWeight: 'bold' }}>${product.price.toLocaleString()}</td>
                <td style={{ padding: '1.5rem' }}>{product.stock}</td>
                <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <button onClick={() => handleDelete(product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px', borderRadius: '8px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente Interno para las Tarjetas de Métricas
const MetricCard = ({ title, value, icon, color }) => (
  <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
    <div style={{ backgroundColor: color, padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>{title}</p>
      <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{value}</h3>
    </div>
  </div>
);

export default AdminPanel;
