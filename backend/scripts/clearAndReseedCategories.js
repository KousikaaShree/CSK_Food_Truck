const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const categories = [
  { name: 'Spice Level 1', description: 'Mild spice level - Perfect for those who prefer gentle flavors' },
  { name: 'Spice Level 2', description: 'Medium spice level - Balanced heat with great flavor' },
  { name: 'Spice Level 3', description: 'Hot spice level - For spice lovers who enjoy intense flavors' }
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

    console.log('\n🎉 Categories reseeded successfully with Spice Levels!');
    console.log(`Total categories: ${await Category.countDocuments()}`);
    process.exit(0);
  } catch (error) {
    console.error('Error reseeding categories:', error);
    process.exit(1);
  }
}

clearAndReseedCategories();

