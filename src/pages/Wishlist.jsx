import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartOff, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#f1f5f9', padding: '2rem', borderRadius: '50%', display: 'inline-flex' }}>
          <HeartOff size={60} color="#94a3b8" />
        </div>
        <h2 style={{ fontSize: '2rem', color: '#1e293b', marginTop: '1.5rem' }}>No tienes favoritos</h2>
        <p style={{ color: '#64748b' }}>Guarda productos para revisarlos mas tarde.</p>
        <Link to="/productos" style={{ display: 'inline-block', marginTop: '1.5rem', backgroundColor: '#3b82f6', color: 'white', padding: '0.8rem 2rem', borderRadius: '10px', textDecoration: 'none', fontWeight: '600' }}>
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/productos')}
        style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem' }}
      >
        <ArrowLeft size={20} /> Volver al catalogo
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#1e293b' }}>Favoritos</h1>
        <button
          onClick={clearWishlist}
          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}
        >
          Vaciar favoritos
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {wishlist.map((product) => (
          <div key={product.id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem', backgroundColor: 'white' }}>
            <div style={{ height: '180px', backgroundColor: '#f1f5f9', borderRadius: '12px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {product.image_url ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'Imagen'}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase' }}>{product.category}</span>
            <h3 style={{ margin: '0.5rem 0', color: '#1e293b' }}>{product.name}</h3>
            <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold', color: '#1e293b' }}>${product.price.toLocaleString()}</p>
            <button
              onClick={() => addToCart(product)}
              style={{ width: '100%', padding: '0.8rem', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ShoppingCart size={18} /> Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
