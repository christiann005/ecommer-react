import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Laptop, Cpu } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        padding: '5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          marginBottom: '1rem',
          background: 'linear-gradient(to right, #60a5fa, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '800'
        }}>
          La Tecnología del Futuro, Hoy
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          maxWidth: '600px', 
          lineHeight: '1.6',
          color: '#cbd5e1',
          marginBottom: '2rem'
        }}>
          Descubre los dispositivos más avanzados, desde laptops de alto rendimiento hasta gadgets inteligentes que transformarán tu vida.
        </p>
        <Link to="/productos" style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '50px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'transform 0.2s, background-color 0.2s',
          boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
        }}>
          Explorar Catálogo <ArrowRight size={20} />
        </Link>
      </section>

      {/* Categorías Rápidas */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f8fafc' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>Categorías Destacadas</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            { icon: <Laptop size={40} />, name: "Laptops", color: "#3b82f6" },
            { icon: <Smartphone size={40} />, name: "Celulares", color: "#a855f7" },
            { icon: <Cpu size={40} />, name: "Componentes", color: "#10b981" }
          ].map((cat, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.3s'
            }}>
              <div style={{ color: cat.color, marginBottom: '1rem' }}>{cat.icon}</div>
              <h3 style={{ margin: 0 }}>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Productos Destacados (Vista Previa) */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto 2rem' }}>
          <h2 style={{ margin: 0 }}>Ofertas de la Semana</h2>
          <Link to="/productos" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Ver todo</Link>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Aquí podrías reutilizar un componente Card más adelante */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ height: '180px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '1rem' }}></div>
            <h3>Smartwatch Pro</h3>
            <p style={{ fontWeight: 'bold', color: '#3b82f6' }}>$199.00</p>
          </div>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ height: '180px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '1rem' }}></div>
            <h3>Auriculares Hi-Fi</h3>
            <p style={{ fontWeight: 'bold', color: '#3b82f6' }}>$149.00</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
