const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const categories = [
  { name: 'Spice Level 1', description: 'Mild spice level - Perfect for those who prefer gentle flavors' },
  { name: 'Spice Level 2', description: 'Medium spice level - Balanced heat with great flavor' },
  { name: 'Spice Level 3', description: 'Hot spice level - For spice lovers who enjoy intense flavors' }
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

