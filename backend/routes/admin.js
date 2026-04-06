const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const Food = require('../models/Food');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const { upload, uploadToCloudinary } = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');
const { 
  generateOrderPDFBuffer, 
  generateBulkOrdersPDFBuffer, 
  generateCustomerReportPDFBuffer 
} = require('../utils/pdfGenerator');
const moment = require('moment-timezone');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ========== CATEGORY MANAGEMENT ==========

// Create category
router.post('/categories', verifyToken, requireAdmin, async (req, res) => {
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
router.get('/categories', verifyToken, requireAdmin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== FOOD MANAGEMENT ==========

// Create food item
router.post('/foods', verifyToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, available, popular } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Upload to Cloudinary (fallback to local uploads if Cloudinary isn't configured)
    let imageUrl;
    try {
      imageUrl = await uploadToCloudinary(req.file.path);
      // Delete local file (only if Cloudinary succeeded)
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    } catch (e) {
      // Keep local file and serve it via /uploads
      imageUrl = `/uploads/${req.file.filename}`;
      console.warn('[admin foods] Cloudinary failed, using local upload:', e.message);
    }

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
      try {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      } catch (_) { }
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update food item
router.put('/foods/:id', verifyToken, requireAdmin, upload.single('image'), async (req, res) => {
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
      try {
        const imageUrl = await uploadToCloudinary(req.file.path);
        food.image = imageUrl;
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      } catch (e) {
        // fallback to local file
        food.image = `/uploads/${req.file.filename}`;
        console.warn('[admin foods update] Cloudinary failed, using local upload:', e.message);
      }
    }

    await food.save();
    await food.populate('category', 'name');

    res.json(food);
  } catch (error) {
    if (req.file) {
      try {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      } catch (_) { }
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete food item
router.delete('/foods/:id', verifyToken, requireAdmin, async (req, res) => {
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
router.get('/foods', verifyToken, requireAdmin, async (req, res) => {
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

// Get all orders (with filters and pagination)
router.get('/orders', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      orderId, 
      customerName, 
      email, 
      fromDate, 
      toDate, 
      status,
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    const query = {};
    const andConditions = [];

    if (orderId) andConditions.push({ orderId: { $regex: orderId, $options: 'i' } });
    if (customerName) {
      andConditions.push({
        $or: [
          { 'address.name': { $regex: customerName, $options: 'i' } },
          { 'user.name': { $regex: customerName, $options: 'i' } }
        ]
      });
    }
    if (email) {
      andConditions.push({
        $or: [
          { 'address.email': { $regex: email, $options: 'i' } },
          { 'user.email': { $regex: email, $options: 'i' } }
        ]
      });
    }
    if (status) andConditions.push({ status: status });

    if (fromDate || toDate) {
      const dateCond = {};
      if (fromDate) dateCond.$gte = new Date(fromDate);
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        dateCond.$lte = end;
      }
      andConditions.push({ createdAt: dateCond });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(query)
      .populate('user', 'name email mobile')
      .populate('items.food', 'name image')
      .populate('deliveryPartner', 'name phone')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalOrders: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get grouped orders (Year -> Month -> Day)
router.get('/orders/grouped', verifyToken, requireAdmin, async (req, res) => {
  try {
    const grouped = await Order.aggregate([
      {
        $project: {
          year: { $year: { date: '$createdAt', timezone: 'Asia/Kolkata' } },
          month: { $month: { date: '$createdAt', timezone: 'Asia/Kolkata' } },
          day: { $dayOfMonth: { date: '$createdAt', timezone: 'Asia/Kolkata' } },
          order: '$$ROOT'
        }
      },
      {
        $group: {
          _id: { year: '$year', month: '$month', day: '$day' },
          orders: { $push: '$order' }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 }
      }
    ]);

    // Reshape for frontend Year -> Month -> Day
    const result = {};
    grouped.forEach(item => {
      const { year, month, day } = item._id;
      if (!result[year]) result[year] = {};
      
      const monthName = moment().month(month - 1).format('MMMM');
      if (!result[year][monthName]) result[year][monthName] = {};
      
      result[year][monthName][day] = item.orders;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download Single Order PDF
router.get('/orders/:id/pdf', verifyToken, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email mobile')
      .populate('items.food', 'name');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const pdfBuffer = await generateOrderPDFBuffer(order);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Order Error:', error);
    res.status(500).json({ message: 'Server error generating PDF', error: error.message });
  }
});

// Download Bulk Orders PDF (based on current filters)
router.get('/orders/export/pdf', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { orderId, customerName, email, fromDate, toDate, status } = req.query;
    const query = {};
    const andConditions = [];

    if (orderId) andConditions.push({ orderId: { $regex: orderId, $options: 'i' } });
    if (customerName) {
      andConditions.push({
        $or: [
          { 'address.name': { $regex: customerName, $options: 'i' } },
          { 'user.name': { $regex: customerName, $options: 'i' } }
        ]
      });
    }
    if (email) {
      andConditions.push({
        $or: [
          { 'address.email': { $regex: email, $options: 'i' } },
          { 'user.email': { $regex: email, $options: 'i' } }
        ]
      });
    }
    if (status) andConditions.push({ status: status });

    if (fromDate || toDate) {
      const dateCond = {};
      if (fromDate) dateCond.$gte = new Date(fromDate);
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        dateCond.$lte = end;
      }
      andConditions.push({ createdAt: dateCond });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    const pdfBuffer = await generateBulkOrdersPDFBuffer(orders, `Orders Report (${orders.length} orders)`);

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Bulk Error:', error);
    res.status(500).json({ message: 'Server error generating bulk PDF', error: error.message });
  }
});

// Get single order
router.get('/orders/:id', verifyToken, requireAdmin, async (req, res) => {
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
router.put('/orders/:id/status', verifyToken, requireAdmin, async (req, res) => {
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
router.put('/orders/:id/assign-delivery', verifyToken, requireAdmin, async (req, res) => {
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
router.post('/delivery', verifyToken, requireAdmin, async (req, res) => {
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
router.get('/delivery', verifyToken, requireAdmin, async (req, res) => {
  try {
    const deliveryPartners = await Delivery.find();
    res.json(deliveryPartners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update delivery partner location
router.put('/delivery/:id/location', verifyToken, requireAdmin, async (req, res) => {
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

// Customer orders summary (customers + number of orders)
router.get('/customer-orders', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { exportPdf } = req.query;
    const rows = await Order.aggregate([
      { $group: { _id: '$user', order_count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          user_id: '$_id',
          name: '$user.name',
          email: '$user.email',
          order_count: 1
        }
      },
      { $sort: { order_count: -1, name: 1 } }
    ]);

    if (exportPdf === 'true') {
      const pdfBuffer = await generateCustomerReportPDFBuffer(rows);
      res.setHeader('Content-Type', 'application/pdf');
      return res.send(pdfBuffer);
    }

    res.json(rows);
  } catch (error) {
    console.error('PDF Customer Report Error:', error);
    res.status(500).json({ message: 'Server error generating report', error: error.message });
  }
});

// Get dashboard stats
router.get('/dashboard', verifyToken, requireAdmin, async (req, res) => {
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

