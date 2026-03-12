import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, SearchX, Loader2, Filter, ChevronRight, Star, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const Products = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estados
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [priceRange, setPriceRange] = useState(10000000); // Rango máximo inicial

  // Obtener búsqueda de la URL
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Error al conectar con el servidor');
        const data = await response.json();
        setProducts(data);
        
        // Ajustar el rango de precio máximo basado en los productos
        if (data.length > 0) {
          const maxPrice = Math.max(...data.map(p => p.price));
          setPriceRange(maxPrice);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Categorías únicas
  const categories = useMemo(() => {
    const cats = ['Todas', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  // Filtrado en tiempo real (Búsqueda + Categoría + Precio)
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery) || 
                           product.description?.toLowerCase().includes(searchQuery);
      const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
      const matchesPrice = product.price <= priceRange;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, selectedCategory, priceRange, products]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: '1.5rem' }}>
        <Loader2 className="animate-spin" size={50} color="#3b82f6" />
        <h2 style={{ color: '#1e293b', fontWeight: '500' }}>Sincronizando catálogo...</h2>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '3rem', padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* SIDEBAR DE FILTROS */}
      <aside style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '120px', height: 'fit-content' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
          <Filter size={20} color="#3b82f6" />
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Filtros</h3>
        </div>

        {/* Búsqueda actual */}
        {searchQuery && (
          <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#3b82f6', fontWeight: 'bold' }}>BUSCANDO:</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600' }}>"{searchQuery}"</span>
              <button onClick={() => setSearchParams({})} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>Limpiar</button>
            </div>
          </div>
        )}

        {/* Categorías */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Categorías</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  textAlign: 'left',
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: selectedCategory === cat ? '#1e293b' : 'transparent',
                  color: selectedCategory === cat ? 'white' : '#1e293b',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  fontWeight: selectedCategory === cat ? '600' : '400'
                }}
              >
                {cat}
                {selectedCategory === cat && <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Rango de Precio */}
        <div>
          <h4 style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Precio Máximo</h4>
          <input 
            type="range" 
            min="0" 
            max={products.length > 0 ? Math.max(...products.map(p => p.price)) : 10000000} 
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', marginBottom: '1rem' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#3b82f6' }}>
            <span>$0</span>
            <span>${priceRange.toLocaleString()}</span>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '2.5rem' }}>{selectedCategory === 'Todas' ? 'Nuestros Productos' : selectedCategory}</h1>
            <p style={{ color: '#64748b', margin: 0 }}>Mostrando {filteredProducts.length} resultados encontrados</p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '8rem 0', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <SearchX size={80} color="#94a3b8" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ color: '#1e293b' }}>No hay coincidencias</h2>
            <p style={{ color: '#64748b' }}>Intenta ajustar los filtros o buscar otro término.</p>
            <button 
              onClick={() => { setSelectedCategory('Todas'); setPriceRange(10000000); setSearchParams({}); }}
              style={{ marginTop: '1.5rem', padding: '0.8rem 2rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => navigate(`/producto/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image-container" style={{ position: 'relative' }}>
                  <img src={product.image_url} alt={product.name} className="product-image" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.12)'
                    }}
                    aria-label="Agregar a favoritos"
                  >
                    <Heart size={18} color={isWishlisted(product.id) ? '#ef4444' : '#64748b'} fill={isWishlisted(product.id) ? '#ef4444' : 'none'} />
                  </button>
                </div>
                <div className="product-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase' }}>{product.category}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
                      <Star size={14} fill="#f59e0b" /> <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1e293b' }}>4.8</span>
                    </div>
                  </div>
                  <h3 className="product-title">{product.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1rem 0', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span className="product-price">${product.price.toLocaleString()}</span>
                    <button 
                      className="add-to-cart-btn"
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      style={{ width: 'auto', padding: '0.8rem 1.2rem', margin: 0 }}
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
