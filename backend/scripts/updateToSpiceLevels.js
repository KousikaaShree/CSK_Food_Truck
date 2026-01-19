const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const newCategories = [
  { name: 'Spice Level 1', description: 'Mild spice level - Perfect for those who prefer gentle flavors' },
  { name: 'Spice Level 2', description: 'Medium spice level - Balanced heat with great flavor' },
  { name: 'Spice Level 3', description: 'Hot spice level - For spice lovers who enjoy intense flavors' }
];

// Old category names to remove (if they exist)
const oldCategoryNames = ['Biryani', 'Momos', 'Wraps', 'Burgers', 'Dosa', 'Juice'];

async function updateToSpiceLevels() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete old categories
    const deleteResult = await Category.deleteMany({ name: { $in: oldCategoryNames } });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} old category/categories\n`);

    // Delete existing spice level categories if they exist (to avoid duplicates)
    await Category.deleteMany({ name: { $regex: /^Spice Level/ } });
    console.log('🧹 Cleaned up any existing spice level categories\n');

    // Create new spice level categories
    console.log('📝 Creating new spice level categories...\n');
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

