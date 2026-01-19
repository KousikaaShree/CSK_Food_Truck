const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const Category = require('../models/Category');

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all foods
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = { available: true };
    
    if (category) {
      const categoryDoc = await Category.findOne({ name: new RegExp(category, 'i') });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    const foods = await Food.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single food
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('category', 'name');
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

