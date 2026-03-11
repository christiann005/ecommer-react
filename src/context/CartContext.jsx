import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { toast } from 'sonner';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('techstore-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ... (código previo)

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    
    // Notificación elegante
    toast.success(`${product.name} añadido al carrito`, {
      description: 'Puedes revisarlo en tu bolsa de compras.',
      duration: 2500,
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const product = prevCart.find(p => p.id === productId);
      if (product) {
        toast.info(`Eliminado: ${product.name}`);
      }
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      try {
        await axios.delete('http://localhost:5000/api/cart/clear');
      } catch (error) {
        console.error("Error vaciando carrito en el servidor", error);
      }
    }
    toast.info('Carrito vaciado');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount,
      cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};
