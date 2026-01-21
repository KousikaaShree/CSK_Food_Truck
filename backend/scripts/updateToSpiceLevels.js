const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const newCategories = [
  { name: 'Shawarma', description: 'Delicious Middle Eastern wraps with marinated meats and fresh vegetables' },
  { name: 'Kebab', description: 'Grilled skewers of seasoned meats, perfect for sharing' },
  { name: 'Barbeque', description: 'Smoky grilled meats and vegetables with authentic BBQ flavors' },
  { name: 'Beverages', description: 'Refreshing drinks including juices, sodas, and specialty beverages' }
];

// Old category names to remove (if they exist)
const oldCategoryNames = ['Spice Level 1', 'Spice Level 2', 'Spice Level 3', 'Biryani', 'Momos', 'Wraps', 'Burgers', 'Dosa', 'Juice'];

async function updateToSpiceLevels() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete old categories
    const deleteResult = await Category.deleteMany({ name: { $in: oldCategoryNames } });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} old category/categories\n`);

    // Delete existing food categories if they exist (to avoid duplicates)
    await Category.deleteMany({ name: { $in: ['Shawarma', 'Kebab', 'Barbeque', 'Beverages'] } });
    console.log('🧹 Cleaned up any existing food categories\n');

    // Create new food categories
    console.log('📝 Creating new food categories...\n');
    for (const category of newCategories) {
      await Category.create(category);
      console.log(`  ✅ Created: ${category.name}`);
    }

    const totalCategories = await Category.countDocuments();
    console.log(`\n🎉 Success! Total categories in database: ${totalCategories}`);
    console.log('\nYour categories are now:');
    const allCategories = await Category.find().sort({ name: 1 });
    allCategories.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating categories:', error);
    process.exit(1);
  }
}

updateToSpiceLevels();

