const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Food = require('../models/Food');

dotenv.config();

const foods = [
  {
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice cooked with tender chicken pieces, infused with exotic spices, saffron, and fresh herbs. Served with raita and a side of pickle. This traditional Hyderabadi-style biryani is slow-cooked to perfection, ensuring each grain of rice is flavorful and the chicken is melt-in-your-mouth tender.',
    price: 280,
    categoryName: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=800&h=600&fit=crop',
    available: true,
    popular: true
  },
  {
    name: 'Steamed Veg Momos',
    description: 'Delicious steamed dumplings filled with a savory mix of fresh vegetables including cabbage, carrots, onions, and aromatic spices. Served hot with our signature spicy red chutney and tangy tomato chutney. These soft, pillowy momos are a perfect appetizer or snack, bursting with flavor in every bite.',
    price: 120,
    categoryName: 'Momos',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop',
    available: true,
    popular: true
  },
  {
    name: 'Chicken Shawarma Wrap',
    description: 'Succulent marinated chicken strips wrapped in a soft, warm tortilla with fresh lettuce, juicy tomatoes, crunchy onions, and our special garlic mayo sauce. The chicken is perfectly spiced and grilled to perfection, creating a harmonious blend of flavors. A complete meal that\'s both satisfying and delicious.',
    price: 180,
    categoryName: 'Wraps',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&h=600&fit=crop',
    available: true,
    popular: true
  }
];

async function seedFoods() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing foods (optional - remove if you want to keep existing)
    // await Food.deleteMany({});
    // console.log('Cleared existing foods');

    for (const foodData of foods) {
      // Find category
      const category = await Category.findOne({ name: foodData.categoryName });
      if (!category) {
        console.log(`Category "${foodData.categoryName}" not found. Please run seed:categories first.`);
        continue;
      }

      // Check if food already exists
      const existing = await Food.findOne({ name: foodData.name });
      if (existing) {
        console.log(`Food "${foodData.name}" already exists. Skipping...`);
        continue;
      }

      // Create food item
      const food = new Food({
        name: foodData.name,
        description: foodData.description,
        price: foodData.price,
        category: category._id,
        categoryName: foodData.categoryName,
        image: foodData.image,
        available: foodData.available,
        popular: foodData.popular
      });

      await food.save();
      console.log(`✅ Created food: ${foodData.name} - ₹${foodData.price}`);
    }

    console.log('\n🎉 Foods seeded successfully!');
    console.log(`Total foods in database: ${await Food.countDocuments()}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding foods:', error);
    process.exit(1);
  }
}

seedFoods();

