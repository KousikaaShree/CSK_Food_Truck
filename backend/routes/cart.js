const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const Cart = require('../models/Cart');
const Food = require('../models/Food');

// Get user cart
router.get('/', authenticateUser, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.food', 'name price image description');

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error('Error in cart route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/add', authenticateUser, async (req, res) => {
  try {
    const { foodId, quantity = 1, customizationData, cartItemId } = req.body;
    console.log('Adding to cart:', { foodId, quantity, customizationData, cartItemId });

    if (!foodId) {
      return res.status(400).json({ message: 'Food ID is required' });
    }

    // Try to find food by ID first, then by name if ID is not a valid ObjectId
    let food = null;
    // Safely check for string before using .match
    if (typeof foodId === 'string' && foodId.match(/^[0-9a-fA-F]{24}$/)) {
      // Valid MongoDB ObjectId
      food = await Food.findById(foodId);
    }
    
    // If not found by ID, and we have a string, try a name lookup (case-insensitive)
    if (!food && typeof foodId === 'string') {
      // Try exact name match (case-insensitive). Escape special regex chars in foodId.
      const escaped = foodId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      food = await Food.findOne({ name: new RegExp('^' + escaped + '$', 'i') });
      if (food) {
        console.log('Found food by name lookup for add:', food.name);
      }
    }
    
    if (!food) {
      console.log('Food not found by ID or name:', foodId);
      return res.status(404).json({ message: 'Food not found. Please refresh and try again.' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [], total: 0 });
      await cart.save();
    }

    // If cartItemId is provided, check for existing item
    if (cartItemId) {
      const existingItemIndex = cart.items.findIndex(
        item => item.cartItemId === cartItemId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        const basePrice = Number(food.price);
        const addOnsTotal = customizationData?.addOns?.reduce((sum, addon) => sum + Number(addon.price || 0), 0) || 0;
        const finalUnitPrice = basePrice + addOnsTotal;

        cart.items.push({
          cartItemId: cartItemId || `${foodId}-${Date.now()}`,
          food: foodId,
          quantity: Number(quantity) || 1,
          price: finalUnitPrice,
          customizationData: customizationData || { addOns: [] }
        });
      }
    } else {
      // No cartItemId, just add the item
      const basePrice = Number(food.price);
      const addOnsTotal = customizationData?.addOns?.reduce((sum, addon) => sum + Number(addon.price || 0), 0) || 0;
      const finalUnitPrice = basePrice + addOnsTotal;

      cart.items.push({
        cartItemId: `${foodId}-${Date.now()}`,
        food: foodId,
        quantity: Number(quantity) || 1,
        price: finalUnitPrice,
        customizationData: customizationData || { addOns: [] }
      });
    }

    // Calculate total
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (Number(item.price || 0) * Number(item.quantity || 0));
    }, 0);

    await cart.save();
    await cart.populate('items.food', 'name price image description');

    res.json(cart);
  } catch (error) {
    console.error('Error in cart/add route:', error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined });
  }
});

// Update item quantity
router.put('/update', authenticateUser, async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.cartItemId === cartItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.food', 'name price image description');

    res.json(cart);
  } catch (error) {
    console.error('Error in cart route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:cartItemId', authenticateUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.cartItemId !== req.params.cartItemId
    );

    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.food', 'name price image description');

    res.json(cart);
  } catch (error) {
    console.error('Error in cart route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.delete('/clear', authenticateUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

