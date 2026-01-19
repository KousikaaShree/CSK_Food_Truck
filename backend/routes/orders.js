const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Food = require('../models/Food');

// Generate unique order ID
const generateOrderId = () => {
  return 'CSK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Create order
router.post('/create', authenticateUser, async (req, res) => {
  try {
    const { address, paymentMethod, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.food');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const subtotal = cart.total;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    const orderItems = cart.items.map(item => ({
      food: item.food._id,
      name: item.food.name,
      quantity: item.quantity,
      price: item.price
    }));

    const order = new Order({
      orderId: generateOrderId(),
      user: req.user._id,
      items: orderItems,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      razorpayOrderId: paymentMethod === 'razorpay' ? razorpayOrderId : undefined,
      razorpayPaymentId: paymentMethod === 'razorpay' ? razorpayPaymentId : undefined,
      razorpaySignature: paymentMethod === 'razorpay' ? razorpaySignature : undefined,
      subtotal,
      tax,
      total,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000) // 45 minutes
    });

    await order.save();
    
    // Clear cart
    cart.items = [];
    cart.total = 0;
    await cart.save();

    await order.populate('items.food', 'name image');
    await order.populate('user', 'name email mobile');
    await order.populate('deliveryPartner', 'name phone');

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user orders
router.get('/my-orders', authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.food', 'name image')
      .populate('deliveryPartner', 'name phone')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single order
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.food', 'name image description')
      .populate('user', 'name email mobile')
      .populate('deliveryPartner', 'name phone vehicleNumber');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

