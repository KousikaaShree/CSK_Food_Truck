import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchCart = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const res = await axios.get('/api/cart', getAuthHeaders());
      setCart(res.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const addToCart = async (foodId, quantity = 1) => {
    if (!user) {
      return { success: false, requiresAuth: true };
    }

    try {
      const res = await axios.post('/api/cart/add', { foodId, quantity }, getAuthHeaders());
      setCart(res.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add to cart' };
    }
  };

  const updateQuantity = async (foodId, quantity) => {
    try {
      const res = await axios.put('/api/cart/update', { foodId, quantity }, getAuthHeaders());
      setCart(res.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update cart' };
    }
  };

  const removeFromCart = async (foodId) => {
    try {
      const res = await axios.delete(`/api/cart/remove/${foodId}`, getAuthHeaders());
      setCart(res.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to remove item' };
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart/clear', getAuthHeaders());
      setCart({ items: [], total: 0 });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to clear cart' };
    }
  };

  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartItemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

