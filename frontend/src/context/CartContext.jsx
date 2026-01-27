import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useMenu } from './MenuContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { items: menuItems } = useMenu();

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('csk_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('csk_cart', JSON.stringify(cart));
  }, [cart]);

  // Helper to generate a unique ID for a cart item based on food ID and addons
  const generateCartItemId = (foodId, addOns = []) => {
    const sortedAddOns = [...addOns].sort((a, b) => a.name.localeCompare(b.name));
    const addOnString = sortedAddOns.map(addon => addon.name).join('|');
    return `${foodId}-${addOnString}`;
  };

  const addToCart = async (foodId, quantity = 1, customizationData = null) => {
    const foodItem = menuItems.find(i => i.id === foodId || i._id === foodId);
    if (!foodItem) return { success: false, message: 'Item not found' };

    const addOns = customizationData?.addOns || [];
    const cartItemId = generateCartItemId(foodId, addOns);

    const basePrice = Number(foodItem.price);
    const addOnsTotal = addOns.reduce((sum, addon) => sum + Number(addon.price), 0);
    const finalUnitPrice = basePrice + addOnsTotal;

    setCart(prev => {
      let newItems = [...prev.items];
      const existingItemIndex = newItems.findIndex(item => item.cartItemId === cartItemId);

      if (existingItemIndex > -1) {
        // Update existing item
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        newItems.push({
          cartItemId,
          food: foodItem,
          quantity,
          price: finalUnitPrice, // Unit price (Base + Addons)
          basePrice,
          customizationData: { addOns }
        });
      }

      // Recalculate total
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        items: newItems,
        total: newTotal
      };
    });

    return { success: true };
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    setCart(prev => {
      // If quantity is 0 or less, remove the item
      if (newQuantity <= 0) {
        const newItems = prev.items.filter(item => item.cartItemId !== cartItemId);
        const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { items: newItems, total: newTotal };
      }

      const newItems = prev.items.map(item => {
        if (item.cartItemId === cartItemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items: newItems, total: newTotal };
    });
    return { success: true };
  };

  const removeFromCart = async (cartItemId) => {
    setCart(prev => {
      const newItems = prev.items.filter(item => item.cartItemId !== cartItemId);
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items: newItems, total: newTotal };
    });
    return { success: true };
  };

  const clearCart = async () => {
    setCart({ items: [], total: 0 });
    return { success: true };
  };

  const getCartItemCount = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

