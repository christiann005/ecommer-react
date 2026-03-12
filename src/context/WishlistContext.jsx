import React, { createContext, useContext, useMemo, useState } from 'react';
import { toast } from 'sonner';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist debe ser usado dentro de un WishlistProvider');
  }
  return context;
};

const STORAGE_KEY = 'techstore-wishlist';

const normalizeProduct = (product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  category: product.category,
  image_url: product.image_url,
});

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const save = (items) => {
    setWishlist(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const isWishlisted = (productId) => wishlist.some((p) => p.id === productId);

  const toggleWishlist = (product) => {
    const exists = isWishlisted(product.id);
    if (exists) {
      const next = wishlist.filter((p) => p.id !== product.id);
      save(next);
      toast.info('Eliminado de favoritos');
      return;
    }
    const next = [normalizeProduct(product), ...wishlist];
    save(next);
    toast.success('Agregado a favoritos');
  };

  const clearWishlist = () => {
    save([]);
    toast.info('Favoritos vaciados');
  };

  const wishlistCount = wishlist.length;
  const value = useMemo(
    () => ({ wishlist, wishlistCount, isWishlisted, toggleWishlist, clearWishlist }),
    [wishlist, wishlistCount]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
