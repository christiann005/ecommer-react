import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Laptop, Home, User, Search, LogOut, Package, Shield, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar sugerencias mientras escribe (con debounce)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length > 1) {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/products/suggestions?q=${searchTerm}`);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error en sugerencias", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300); // 300ms de retraso para no saturar el servidor

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?search=${searchTerm.trim()}`);
      setShowSuggestions(false);
    }
  };

  const goToProduct = (id) => {
    navigate(`/producto/${id}`);
    setShowSuggestions(false);
    setSearchTerm('');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1a1a1a',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      {/* Logo */}
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: 'white' }}>
        Tech<span style={{ color: '#3b82f6' }}>Store</span>
      </Link>

      {/* Buscador Predictivo */}
      <div ref={searchRef} style={{ flex: 1, maxWidth: '500px', position: 'relative' }}>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input 
            type="text"
            placeholder="¿Qué buscas hoy? Laptops, Celulares..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
            style={{
              width: '100%',
              padding: '0.8rem 1rem 0.8rem 2.8rem',
              borderRadius: '50px',
              border: 'none',
              backgroundColor: '#2d2d2d',
              color: 'white',
              outline: 'none',
              fontSize: '0.95rem',
              transition: 'background-color 0.2s'
            }}
          />
          <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '14px' }} />
          {searchTerm && (
            <X 
              size={18} 
              color="#94a3b8" 
              style={{ position: 'absolute', right: '14px', cursor: 'pointer' }} 
              onClick={() => { setSearchTerm(''); setSuggestions([]); }}
            />
          )}
        </form>

        {/* Lista de Sugerencias */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            zIndex: 2000
          }}>
            <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Productos Recomendados
            </div>
            {suggestions.map(product => (
              <div 
                key={product.id}
                onClick={() => goToProduct(product.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.8rem 1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f8fafc',
                  transition: 'background-color 0.2s',
                  color: '#1e293b'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <img src={product.image_url} alt={product.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#f8fafc' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{product.name}</p>
                  <p style={{ margin: 0, color: '#3b82f6', fontWeight: 'bold', fontSize: '0.85rem' }}>${product.price.toLocaleString()}</p>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '50px' }}>{product.category}</span>
              </div>
            ))}
            <div 
              onClick={handleSearchSubmit}
              style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#f8fafc', color: '#3b82f6', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Ver todos los resultados para "{searchTerm}"
            </div>
          </div>
        )}
      </div>
      
      {/* Menú de Navegación */}
      <ul style={{ display: 'flex', listStyle: 'none', gap: '2rem', margin: 0, padding: 0, alignItems: 'center' }}>
        <li>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Home size={18} /> <span className="nav-text">Inicio</span>
          </Link>
        </li>
        <li>
          <Link to="/productos" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Laptop size={18} /> <span className="nav-text">Productos</span>
          </Link>
        </li>
        
        {user ? (
          <>
            <li>
              <Link to="/mis-ordenes" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Package size={18} /> <span className="nav-text">Mis Órdenes</span>
              </Link>
            </li>
            {user.role === 'admin' && (
              <li>
                <Link to="/admin" style={{ color: '#fbbf24', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                  <Shield size={18} /> <span className="nav-text">Admin</span>
                </Link>
              </li>
            )}
            <li style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#3b82f6', fontWeight: 'bold' }}>Hola, {user.username}</span>
              <button onClick={logout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <LogOut size={20} />
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <User size={22} /> <span className="nav-text">Login</span>
            </Link>
          </li>
        )}
        <li style={{ position: 'relative' }}>
          <Link to="/carrito" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShoppingCart size={22} />
            {cartCount > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-10px', backgroundColor: '#ef4444', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold' }}>{cartCount}</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
