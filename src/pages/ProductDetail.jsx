import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import axios from 'axios';
import { toast } from 'sonner';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, Loader2, Star, MessageSquare, Send, Heart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para la nueva reseÃ±a
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, revRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/${id}`),
          axios.get(`http://localhost:5000/api/reviews/${id}`)
        ]);
        setProduct(prodRes.data);
        setReviews(revRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Debes iniciar sesiÃ³n para calificar');
      return;
    }
    if (comment.trim().length < 5) {
      toast.error('El comentario es muy corto');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/reviews', {
        rating,
        comment,
        productId: id
      });
      setReviews([data, ...reviews]);
      setComment('');
      setRating(5);
      toast.success('Â¡Gracias por tu opiniÃ³n!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al enviar reseÃ±a');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Loader2 className="animate-spin" size={50} color="#3b82f6" /></div>;
  if (error || !product) return <div style={{ padding: '5rem', textAlign: 'center' }}><h2>{error || 'Producto no encontrado'}</h2><Link to="/productos" style={{ color: '#3b82f6' }}>Volver al catÃ¡logo</Link></div>;

  // Calcular promedio de estrellas
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/productos" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#64748b', marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Volver a Productos
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '5rem', alignItems: 'start', marginBottom: '6rem' }}>
        {/* Imagen */}
        <div style={{ height: '500px', backgroundColor: 'white', borderRadius: '32px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
           {product.image_url ? <img src={product.image_url} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }} /> : '[Imagen]'}
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
              <span style={{ color: '#3b82f6', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>{product.category}</span>
              {reviews.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#fef3c7', padding: '4px 10px', borderRadius: '50px', color: '#d97706', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  <Star size={16} fill="#d97706" /> {averageRating} ({reviews.length})
                </div>
              )}
            </div>
            <h1 style={{ fontSize: '3.5rem', margin: '0 0 1rem 0', color: '#1e293b', fontWeight: '800', lineHeight: '1.1' }}>{product.name}</h1>
            <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#3b82f6' }}>${product.price.toLocaleString()}</p>
          </div>

          <p style={{ color: '#64748b', fontSize: '1.2rem', lineHeight: '1.7' }}>{product.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', backgroundColor: '#f8fafc', padding: '1.2rem', borderRadius: '20px' }}>
              <Truck size={24} color="#3b82f6" /> 
              <div>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>EnvÃ­o Gratis</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Llega en 3-5 dÃ­as</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', backgroundColor: '#f8fafc', padding: '1.2rem', borderRadius: '20px' }}>
              <ShieldCheck size={24} color="#3b82f6" /> 
              <div>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>GarantÃ­a Tech</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>12 meses oficial</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px', gap: '1rem' }}>
            <button 
              onClick={() => addToCart(product)}
              style={{ padding: '1.5rem', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '20px', fontSize: '1.2rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', transition: 'all 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#334155'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
            >
              <ShoppingCart size={24} /> AÃ±adir al Carrito
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              style={{ border: '1px solid #e2e8f0', borderRadius: '18px', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Agregar a favoritos"
            >
              <Heart size={26} color={isWishlisted(product.id) ? '#ef4444' : '#64748b'} fill={isWishlisted(product.id) ? '#ef4444' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÃ“N DE RESEÃ‘AS */}
      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', marginBottom: '4rem' }} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '5rem' }}>
        
        {/* Formulario de ReseÃ±a */}
        <div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={24} color="#3b82f6" /> Danos tu opiniÃ³n
          </h3>
          
          {user ? (
            <form onSubmit={handleReviewSubmit} style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#64748b' }}>CalificaciÃ³n:</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <Star 
                        size={32} 
                        fill={star <= rating ? "#f59e0b" : "none"} 
                        color={star <= rating ? "#f59e0b" : "#cbd5e1"} 
                        style={{ transition: 'transform 0.1s' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#64748b' }}>Tu comentario:</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Â¿QuÃ© te pareciÃ³ este producto?"
                  rows="4"
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outlineColor: '#3b82f6', fontSize: '1rem', resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{ width: '100%', padding: '1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Publicar ReseÃ±a</>}
              </button>
            </form>
          ) : (
            <div style={{ backgroundColor: '#eff6ff', padding: '2rem', borderRadius: '24px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
              <p style={{ color: '#1e40af', fontWeight: '600', marginBottom: '1rem' }}>Inicia sesiÃ³n para compartir tu experiencia con otros compradores.</p>
              <Link to="/login" style={{ display: 'inline-block', padding: '0.8rem 1.5rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold' }}>Ir al Login</Link>
            </div>
          )}
        </div>

        {/* Lista de ReseÃ±as */}
        <div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Opiniones de clientes ({reviews.length})</h3>
          
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
              <Star size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>AÃºn no hay reseÃ±as para este producto. Â¡SÃ© el primero en calificarlo!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {reviews.map(review => (
                <div key={review.id} style={{ padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ margin: '0 0 5px 0', fontWeight: '800', color: '#1e293b', fontSize: '1.1rem' }}>{review.User?.username}</p>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            size={16} 
                            fill={star <= review.rating ? "#f59e0b" : "none"} 
                            color={star <= review.rating ? "#f59e0b" : "#cbd5e1"} 
                          />
                        ))}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ margin: 0, color: '#475569', lineHeight: '1.6', fontSize: '1.05rem' }}>"{review.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
