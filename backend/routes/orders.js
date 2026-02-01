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
    const { address, paymentMethod, razorpayOrderId, razorpayPaymentId, razorpaySignature, cartItems } = req.body;
    console.log('Creating order with:', { address, paymentMethod, hasCartItems: !!cartItems });

    let cart = await Cart.findOne({ user: req.user._id }).populate('items.food');
    
    // If backend cart is empty but frontend sent cart items, use them
    if ((!cart || cart.items.length === 0) && cartItems && cartItems.length > 0) {
      console.log('Backend cart empty, using frontend cart items');
      
      // Validate and populate cart items from frontend
      const validatedItems = [];
      let calculatedSubtotal = 0;
      
      for (const item of cartItems) {
        // Try multiple ways to get the food ID or name
        const foodId = item.foodId || item.food?.id || item.food?._id || (item.food && typeof item.food === 'string' ? item.food : null);
        const foodName = item.food?.name || item.name;
        
        let food = null;
        
        // Try to find by ID if it's a valid MongoDB ObjectId
        if (foodId && foodId.match(/^[0-9a-fA-F]{24}$/)) {
          food = await Food.findById(foodId);
        }
        
        // If not found by ID, try to find by name (for frontend custom IDs)
        if (!food && foodName) {
          food = await Food.findOne({ name: foodName });
          console.log('Found food by name:', foodName, food ? 'Found' : 'Not found');
        }
        
        // Last resort: try to find by any field that might match
        if (!food && foodId) {
          // Try as string search in name or description
          food = await Food.findOne({ 
            $or: [
              { name: { $regex: foodId, $options: 'i' } },
              { _id: foodId }
            ]
          });
        }
        
        if (!food) {
          // If frontend sent name and price, allow creating order item without DB food ref
          if (item.name && (item.price || item.price === 0)) {
            const addOnsTotal = item.customizationData?.addOns?.reduce((sum, addon) => sum + Number(addon.price || 0), 0) || 0;
            const finalUnitPrice = Number(item.price) + addOnsTotal;
            validatedItems.push({
              food: undefined,
              name: item.name,
              quantity: Number(item.quantity) || 1,
              price: finalUnitPrice,
              customizationData: item.customizationData || { addOns: [] }
            });
            calculatedSubtotal += finalUnitPrice * (Number(item.quantity) || 1);
            continue;
          }
          console.error('Food not found for item and no fallback available:', { foodId, foodName, item });
          continue;
        }
        
        // Use the price from the item if available, otherwise calculate from food
        const itemPrice = item.price ? Number(item.price) : Number(food.price);
        const addOnsTotal = item.customizationData?.addOns?.reduce((sum, addon) => sum + Number(addon.price || 0), 0) || 0;
        const finalUnitPrice = itemPrice + addOnsTotal;
        const itemQuantity = Number(item.quantity) || 1;
        
        validatedItems.push({
          food: food._id,
          name: food.name,
          quantity: itemQuantity,
          price: finalUnitPrice,
          customizationData: item.customizationData || { addOns: [] }
        });
        
        calculatedSubtotal += finalUnitPrice * itemQuantity;
      }
      
      if (validatedItems.length === 0) {
        return res.status(400).json({ message: 'No valid items found in cart' });
      }
      
      const tax = calculatedSubtotal * 0.18;
      const total = calculatedSubtotal + tax;
      
      const order = new Order({
        orderId: generateOrderId(),
        user: req.user._id,
        items: validatedItems,
        address,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        razorpayOrderId: paymentMethod === 'razorpay' ? razorpayOrderId : undefined,
        razorpayPaymentId: paymentMethod === 'razorpay' ? razorpayPaymentId : undefined,
        razorpaySignature: paymentMethod === 'razorpay' ? razorpaySignature : undefined,
        subtotal: calculatedSubtotal,
        tax,
        total,
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000)
      });
      
      await order.save();
      await order.populate('items.food', 'name image');
      await order.populate('user', 'name email mobile');
      await order.populate('deliveryPartner', 'name phone');
      
      return res.status(201).json(order);
    }
    
    // Use backend cart (original flow)
    if (!cart || cart.items.length === 0) {
      console.log('Cart empty or not found for user:', req.user._id);
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const subtotal = cart.total;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    const orderItems = cart.items.map(item => {
      if (!item.food) {
        console.error('Cart item missing food object:', item);
        return null;
      }
      return {
        food: item.food._id,
        name: item.food.name,
        quantity: item.quantity,
        price: item.price,
        customizationData: item.customizationData
      };
    }).filter(i => i !== null);

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
    console.error('Error in /api/orders/create:', error);
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

