# Adding Sample Foods - Quick Guide

## 🍽️ Sample Foods Added

I've created a seed script that adds 3 delicious dishes with detailed descriptions:

1. **Chicken Biryani** - ₹280
   - Category: Biryani
   - Detailed description included
   - High-quality food image

2. **Steamed Veg Momos** - ₹120
   - Category: Momos
   - Detailed description included
   - High-quality food image

3. **Chicken Shawarma Wrap** - ₹180
   - Category: Wraps
   - Detailed description included
   - High-quality food image

## 🚀 How to Add These Foods

### Step 1: Make sure categories are seeded
```bash
cd backend
npm run seed:categories
```

### Step 2: Seed the food items
```bash
npm run seed:foods
```

**Expected Output:**
```
Connected to MongoDB
✅ Created food: Chicken Biryani - ₹280
✅ Created food: Steamed Veg Momos - ₹120
✅ Created food: Chicken Shawarma Wrap - ₹180

🎉 Foods seeded successfully!
Total foods in database: 3
```

### Step 3: Verify in Application

1. Start your servers:
   ```bash
   # Terminal 1
   cd backend
   npm run dev

   # Terminal 2
   cd frontend
   npm run dev
   ```

2. Open http://localhost:3000

3. You should see all 3 dishes displayed with:
   - ✅ Food images
   - ✅ Detailed descriptions
   - ✅ Prices
   - ✅ "Add to Cart" buttons

## 📝 Food Details

### Chicken Biryani - ₹280
**Description:**
Aromatic basmati rice cooked with tender chicken pieces, infused with exotic spices, saffron, and fresh herbs. Served with raita and a side of pickle. This traditional Hyderabadi-style biryani is slow-cooked to perfection, ensuring each grain of rice is flavorful and the chicken is melt-in-your-mouth tender.

### Steamed Veg Momos - ₹120
**Description:**
Delicious steamed dumplings filled with a savory mix of fresh vegetables including cabbage, carrots, onions, and aromatic spices. Served hot with our signature spicy red chutney and tangy tomato chutney. These soft, pillowy momos are a perfect appetizer or snack, bursting with flavor in every bite.

### Chicken Shawarma Wrap - ₹180
**Description:**
Succulent marinated chicken strips wrapped in a soft, warm tortilla with fresh lettuce, juicy tomatoes, crunchy onions, and our special garlic mayo sauce. The chicken is perfectly spiced and grilled to perfection, creating a harmonious blend of flavors. A complete meal that's both satisfying and delicious.

## 🎨 Features

- ✅ Full detailed descriptions displayed
- ✅ High-quality food images from Unsplash
- ✅ "Add to Cart" button on each card
- ✅ Responsive design
- ✅ Hover effects
- ✅ Price display
- ✅ Category filtering works

## 🔄 Update Images (Optional)

If you want to use your own images:

1. Upload images to Cloudinary
2. Get the image URLs
3. Update the `image` field in `backend/scripts/seedFoods.js`
4. Or update via Admin Panel after seeding

## 📱 View in Application

Once seeded, the foods will appear:
- On the home page
- In their respective categories
- With full descriptions visible
- With working "Add to Cart" functionality

---

**Note:** The seed script checks for existing foods, so running it multiple times won't create duplicates. To reset, delete foods from database or admin panel first.

