import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import AdminPanel from './pages/AdminPanel';
import Wishlist from './pages/Wishlist';
import { Toaster } from 'sonner';
import './App.css';

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors closeButton />
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 160px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/mis-ordenes" element={<MyOrders />} />
          <Route path="/favoritos" element={<Wishlist />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #eee'
      }}>
        <p>&copy; 2026 TechStore - Lo mejor en Tecnología.</p>
      </footer>
    </div>
  );
}

export default App;
