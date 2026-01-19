const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const Food = require('../models/Food');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const { upload, uploadToCloudinary } = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ========== CATEGORY MANAGEMENT ==========

// Create category
router.post('/categories', authenticateAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const category = new Category({ name, description });
    await category.save();
    
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all categories
router.get('/categories', authenticateAdmin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== FOOD MANAGEMENT ==========

// Create food item
router.post('/foods', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, available, popular } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.path);
    
    // Delete local file
    fs.unlinkSync(req.file.path);

    const food = new Food({
      name,
      description,
      price: parseFloat(price),
      category,
      categoryName: categoryDoc.name,
      image: imageUrl,
      available: available === 'true',
      popular: popular === 'true'
    });

    await food.save();
    await food.populate('category', 'name');
    
    res.status(201).json(food);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update food item
router.put('/foods/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, available, popular } = req.body;
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    if (name) food.name = name;
    if (description) food.description = description;
    if (price) food.price = parseFloat(price);
    if (available !== undefined) food.available = available === 'true';
    if (popular !== undefined) food.popular = popular === 'true';

    if (category) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(404).json({ message: 'Category not found' });
      }
      food.category = category;
      food.categoryName = categoryDoc.name;
    }

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.path);
      food.image = imageUrl;
      fs.unlinkSync(req.file.path);
    }

    await food.save();
    await food.populate('category', 'name');
    
    res.json(food);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete food item
router.delete('/foods/:id', authenticateAdmin, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all foods (admin)
router.get('/foods', authenticateAdmin, async (req, res) => {
  try {
    const foods = await Food.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== ORDER MANAGEMENT ==========

// Get all orders
router.get('/orders', authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email mobile')
      .populate('items.food', 'name image')
      .populate('deliveryPartner', 'name phone')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single order
router.get('/orders/:id', authenticateAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email mobile')
      .populate('items.food', 'name image description')
      .populate('deliveryPartner', 'name phone vehicleNumber');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    
    if (status === 'delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }

    await order.save();
    await order.populate('user', 'name email mobile');
    await order.populate('items.food', 'name image');
    await order.populate('deliveryPartner', 'name phone');

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign delivery partner
router.put('/orders/:id/assign-delivery', authenticateAdmin, async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const deliveryPartner = await Delivery.findById(deliveryPartnerId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    order.deliveryPartner = deliveryPartnerId;
    if (order.status === 'preparing') {
      order.status = 'out_for_delivery';
    }

    deliveryPartner.activeOrders.push(order._id);
    await deliveryPartner.save();
    await order.save();

    await order.populate('deliveryPartner', 'name phone vehicleNumber');

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== DELIVERY PARTNER MANAGEMENT ==========

// Create delivery partner
router.post('/delivery', authenticateAdmin, async (req, res) => {
  try {
    const { name, phone, vehicleNumber } = req.body;
    
    const delivery = new Delivery({ name, phone, vehicleNumber });
    await delivery.save();
    
    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all delivery partners
router.get('/delivery', authenticateAdmin, async (req, res) => {
  try {
    const deliveryPartners = await Delivery.find();
    res.json(deliveryPartners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update delivery partner location
router.put('/delivery/:id/location', authenticateAdmin, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    delivery.currentLocation = { lat, lng };
    await delivery.save();

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== DASHBOARD ANALYTICS ==========

// Get dashboard stats
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });

    const popularItems = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.food', count: { $sum: '$items.quantity' }, name: { $first: '$items.name' } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayOrders,
      popularItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

