const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const categories = [
  { name: 'Shawarma', description: 'Delicious Middle Eastern wraps with marinated meats and fresh vegetables' },
  { name: 'Kebab', description: 'Grilled skewers of seasoned meats, perfect for sharing' },
  { name: 'Barbeque', description: 'Smoky grilled meats and vegetables with authentic BBQ flavors' },
  { name: 'Beverages', description: 'Refreshing drinks including juices, sodas, and specialty beverages' }
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const category of categories) {
      const existing = await Category.findOne({ name: category.name });
      if (!existing) {
        await Category.create(category);
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${category.name}`);
      }
    }

    console.log('Categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();

