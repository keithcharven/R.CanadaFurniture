import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart from server when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Load from localStorage for guests
      const stored = localStorage.getItem('guestCart');
      if (stored) {
        const items = JSON.parse(stored);
        setCartItems(items);
        calculateTotal(items);
      }
    }
  }, [isAuthenticated]);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const price = item.product ? parseFloat(item.product.price) : parseFloat(item.price || 0);
      return sum + price * item.quantity;
    }, 0);
    setCartTotal(total);
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCartItems(data.cart.items || []);
      setCartTotal(parseFloat(data.cart.total) || 0);
    } catch (err) {
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        await api.post('/cart/items', { product_id: product.id, quantity });
        await fetchCart();
      } catch (err) {
        throw err;
      }
    } else {
      // Guest cart in localStorage
      const existing = cartItems.find(i => i.product_id === product.id);
      let updated;
      if (existing) {
        updated = cartItems.map(i =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        updated = [...cartItems, { product_id: product.id, product, quantity, id: Date.now() }];
      }
      setCartItems(updated);
      calculateTotal(updated);
      localStorage.setItem('guestCart', JSON.stringify(updated));
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (isAuthenticated) {
      try {
        if (quantity <= 0) {
          await api.delete(`/cart/items/${itemId}`);
        } else {
          await api.put(`/cart/items/${itemId}`, { quantity });
        }
        await fetchCart();
      } catch (err) {
        console.error('Update cart error:', err);
      }
    } else {
      let updated;
      if (quantity <= 0) {
        updated = cartItems.filter(i => i.id !== itemId);
      } else {
        updated = cartItems.map(i => i.id === itemId ? { ...i, quantity } : i);
      }
      setCartItems(updated);
      calculateTotal(updated);
      localStorage.setItem('guestCart', JSON.stringify(updated));
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        await api.delete(`/cart/items/${itemId}`);
        await fetchCart();
      } catch (err) {
        console.error('Remove from cart error:', err);
      }
    } else {
      const updated = cartItems.filter(i => i.id !== itemId);
      setCartItems(updated);
      calculateTotal(updated);
      localStorage.setItem('guestCart', JSON.stringify(updated));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
        setCartItems([]);
        setCartTotal(0);
      } catch (err) {
        console.error('Clear cart error:', err);
      }
    } else {
      setCartItems([]);
      setCartTotal(0);
      localStorage.removeItem('guestCart');
    }
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartTotal, itemCount, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
