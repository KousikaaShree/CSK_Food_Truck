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

async function clearAndReseedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear all existing categories
    await Category.deleteMany({});
    console.log('Cleared all existing categories');

    // Create new categories
    for (const category of categories) {
      await Category.create(category);
      console.log(`✅ Created category: ${category.name}`);
    }

    console.log('\n🎉 Categories reseeded successfully with Food Categories!');
    console.log(`Total categories: ${await Category.countDocuments()}`);
    process.exit(0);
  } catch (error) {
    console.error('Error reseeding categories:', error);
    process.exit(1);
  }
}

clearAndReseedCategories();

