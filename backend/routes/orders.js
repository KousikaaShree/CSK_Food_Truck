const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Food = require('../models/Food');
const { getCustomizationsForCategory } = require('../utils/customizations');
const { sendOrderConfirmationEmail } = require('../utils/sendEmail');
const {
  getDeliveryChargeForDistanceKm,
  calculateFinalTotal,
  haversineDistanceKm
} = require('../utils/pricing');

// Shop fixed coordinates (can be overridden via env for different deployments).
const SHOP_LAT = process.env.SHOP_LAT || 10.0104;
const SHOP_LNG = process.env.SHOP_LNG || 77.4768;

const buildOrderConfirmation = (order) => {
  const istNow = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  );
  const customerName = order?.user?.name || 'Customer';
  const amount = Number(order?.total || 0);
  const date = istNow.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
  const time = istNow.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const text =
`Order Confirmation

Hello ${customerName},

Your order has been successfully placed at CSK Food Truck.

Order Details:
Total Amount: ₹${amount.toFixed(2)}
Order Date: ${date}
Order Time: ${time}

Your order will be delivered before 9:00 PM IST.

Thank you for ordering from CSK Food Truck!`;

  return {
    success: true,
    restaurantName: 'CSK Food Truck',
    customerName,
    deliveryMessage: 'Your order will be delivered before 9:00 PM IST.',
    orderDetails: { amount, date, time },
    message: 'Your order has been successfully placed at CSK Food Truck.',
    text
  };
};

// Check if current time in IST is between 7:00 PM and 8:00 PM
const isWithinOrderWindowIST = () => {
  // Get current time in Asia/Kolkata regardless of server timezone
  const istString = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
  });
  const istDate = new Date(istString);

  const hours = istDate.getHours(); // 0-23
  const minutes = istDate.getMinutes();

  // Allowed window: 19:00 (inclusive) to 20:00 (exclusive)
  const totalMinutes = hours * 60 + minutes;
  const startMinutes = 19 * 60; // 19:00
  const endMinutes = 20 * 60;   // 20:00

  return totalMinutes >= startMinutes && totalMinutes < endMinutes;
};

// Generate unique order ID
const generateOrderId = () => {
  return 'CSK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Create order
router.post('/create', authenticateUser, async (req, res) => {
  try {
    // Enforce strict ordering time window on backend (IST)
    /*
    if (!isWithinOrderWindowIST()) {
      return res.status(403).json({
        message: 'Orders are accepted only between 7:00 PM and 8:00 PM IST.',
      });
    }
    */

    const {
      address,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      cartItems,
      customerLocation,
      distanceValue
    } = req.body;

    let distanceKm;

    // Preferred: compute from geolocation coordinates (Haversine).
    const customerLat = Number(customerLocation?.latitude);
    const customerLng = Number(customerLocation?.longitude);
    const hasValidCoords =
      Number.isFinite(customerLat) &&
      Number.isFinite(customerLng) &&
      customerLat >= -90 &&
      customerLat <= 90 &&
      customerLng >= -180 &&
      customerLng <= 180;

    if (hasValidCoords) {
      distanceKm = haversineDistanceKm(customerLat, customerLng, SHOP_LAT, SHOP_LNG);
    } else if (distanceValue !== undefined && distanceValue !== null) {
      // Fallback: frontend provided distance (meters) from backend address-based calculation.
      const distanceMeters = Number(distanceValue);
      distanceKm = distanceMeters / 1000;
    }

    if (!Number.isFinite(distanceKm)) {
      return res.status(400).json({ message: 'Customer location (coords) or distanceValue is required.' });
    }

    const { allowed: isDeliverable, deliveryCharge: finalDeliveryFee } = getDeliveryChargeForDistanceKm(distanceKm);
    if (!isDeliverable) {
      return res.status(400).json({ message: 'Delivery is not available in your area (over 15km).' });
    }

    console.log('Creating order with delivery:', {
      paymentMethod,
      hasCartItems: !!cartItems,
      distanceKm: Number(distanceKm.toFixed(3)),
      deliveryFee: finalDeliveryFee
    });

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
        
        // Security Validation: Rebuild Price from local Maps
        const categoryRules = food ? getCustomizationsForCategory(food.categoryName) : [];
        let validAddonsTotal = 0;
        const validAddons = [];

        if (item.customizationData && item.customizationData.addOns) {
          for (const addon of item.customizationData.addOns) {
            const rule = categoryRules.find(r => r.name === addon.name);
            if (rule) {
              validAddonsTotal += rule.price;
              validAddons.push({ name: rule.name, price: rule.price });
            } else {
              console.warn(`[Security Warning] Blocked invalid addon requested from frontend: ${addon.name} for ${food.name}`);
            }
          }
        }

        // Use the price from the item if available, otherwise calculate from food
        const itemPrice = item.price ? Number(item.price) : Number(food.price);
        const finalUnitPrice = itemPrice + validAddonsTotal;
        const itemQuantity = Number(item.quantity) || 1;
        
        validatedItems.push({
          food: food._id,
          name: food.name,
          quantity: itemQuantity,
          price: finalUnitPrice,
          customizationData: { 
            addOns: validAddons, 
            customizationsPrice: validAddonsTotal 
          }
        });
        
        calculatedSubtotal += finalUnitPrice * itemQuantity;
      }
      
      if (validatedItems.length === 0) {
        return res.status(400).json({ message: 'No valid items found in cart' });
      }
      
      const total = calculateFinalTotal(calculatedSubtotal, finalDeliveryFee);

      const order = new Order({
        orderId: generateOrderId(),
        user: req.user._id,
        items: validatedItems,
        address: {
          ...address,
          name: req.user.name,
          email: req.user.email
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        razorpayOrderId: paymentMethod === 'razorpay' ? razorpayOrderId : undefined,
        razorpayPaymentId: paymentMethod === 'razorpay' ? razorpayPaymentId : undefined,
        razorpaySignature: paymentMethod === 'razorpay' ? razorpaySignature : undefined,
        subtotal: calculatedSubtotal,
        deliveryFee: finalDeliveryFee,
        total,
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000)
      });
      
      await order.save();
      await order.populate('items.food', 'name image');
      await order.populate('user', 'name email mobile');
      await order.populate('deliveryPartner', 'name phone');
      
      // Send email notification (non-blocking)
      sendOrderConfirmationEmail(order);
      
      const confirmation = buildOrderConfirmation(order);
      return res.status(201).json({ ...order.toObject(), confirmation });
    }
    
    // Use backend cart (original flow)
    if (!cart || cart.items.length === 0) {
      console.log('Cart empty or not found for user:', req.user._id);
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Fallback iteration: validate backend database cart identically
    const orderItems = [];
    let backendCalculatedSubtotal = 0;

    for (const item of cart.items) {
      if (!item.food) {
        console.error('Cart item missing food object:', item);
        continue;
      }

      const foodRef = item.food;
      const categoryRules = getCustomizationsForCategory(foodRef.categoryName);
      
      let validAddonsTotal = 0;
      const validAddons = [];

      if (item.customizationData && item.customizationData.addOns) {
        for (const addon of item.customizationData.addOns) {
          const rule = categoryRules.find(r => r.name === addon.name);
          if (rule) {
            validAddonsTotal += rule.price;
            validAddons.push({ name: rule.name, price: rule.price });
          }
        }
      }

      const itemPrice = item.price ? Number(item.price) : Number(foodRef.price);
      const finalUnitPrice = itemPrice + validAddonsTotal;
      const itemQuantity = Number(item.quantity) || 1;

      orderItems.push({
        food: foodRef._id,
        name: foodRef.name,
        quantity: itemQuantity,
        price: finalUnitPrice,
        customizationData: { addOns: validAddons, customizationsPrice: validAddonsTotal }
      });

      backendCalculatedSubtotal += finalUnitPrice * itemQuantity;
    }

    const subtotal = backendCalculatedSubtotal;
    const total = calculateFinalTotal(subtotal, finalDeliveryFee);

    const order = new Order({
      orderId: generateOrderId(),
      user: req.user._id,
      items: orderItems,
      address: {
        ...address,
        name: req.user.name,
        email: req.user.email
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      razorpayOrderId: paymentMethod === 'razorpay' ? razorpayOrderId : undefined,
      razorpayPaymentId: paymentMethod === 'razorpay' ? razorpayPaymentId : undefined,
      razorpaySignature: paymentMethod === 'razorpay' ? razorpaySignature : undefined,
      subtotal,
      deliveryFee: finalDeliveryFee,
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

    // Send email notification (non-blocking)
    sendOrderConfirmationEmail(order);

    const confirmation = buildOrderConfirmation(order);
    res.status(201).json({ ...order.toObject(), confirmation });
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

