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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/add', authenticateUser, async (req, res) => {
  try {
    const { foodId, quantity = 1 } = req.body;
    
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.food.toString() === foodId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        food: foodId,
        quantity,
        price: food.price
      });
    }

    // Calculate total
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.food', 'name price image description');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item quantity
router.put('/update', authenticateUser, async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.food.toString() === foodId
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:foodId', authenticateUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.food.toString() !== req.params.foodId
    );

    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.food', 'name price image description');
    
    res.json(cart);
  } catch (error) {
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

