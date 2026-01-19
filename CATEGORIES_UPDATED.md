# Categories Updated to Spice Levels! 🌶️

## ✅ Changes Made

The categories have been updated to use **Spice Levels** instead of food types:

### New Categories:
1. **Spice Level 1** - Mild spice level - Perfect for those who prefer gentle flavors
2. **Spice Level 2** - Medium spice level - Balanced heat with great flavor  
3. **Spice Level 3** - Hot spice level - For spice lovers who enjoy intense flavors

## 🔄 How to Update Your Database

### Option 1: Clear and Reseed (Recommended if you want fresh categories)

This will delete all existing categories and create the new spice level categories:

```bash
cd backend
npm run reseed:categories
```

**Note**: This will delete all existing categories. Make sure you're okay with this, or use Option 2.

### Option 2: Add New Categories (Keeps existing categories)

If you want to keep existing categories and just add the spice levels:

```bash
cd backend
npm run seed:categories
```

This will add the spice level categories without deleting existing ones.

## 📝 What Changed

### Files Updated:
- ✅ `backend/scripts/seedCategories.js` - Updated with spice level categories
- ✅ `backend/scripts/clearAndReseedCategories.js` - New script to clear and reseed
- ✅ `backend/package.json` - Added `reseed:categories` script

## 🎯 Using in Admin Panel

After reseeding categories:

1. **Go to Admin Menu**: http://localhost:3000/admin/menu
2. **Add Food Item**: Click "Add Food Item"
3. **Select Category**: You'll see the dropdown with:
   - Spice Level 1
   - Spice Level 2
   - Spice Level 3

## ⚠️ Important Notes

1. **Existing Foods**: If you have foods assigned to old categories (Biryani, Momos, etc.), they will still work, but you should reassign them to spice levels in the admin panel.

2. **User Website**: The home page will show the new spice level categories as filters.

3. **Category Display**: Categories will appear as:
   - "Spice Level 1"
   - "Spice Level 2"
   - "Spice Level 3"

## 🔧 Recommended Next Steps

1. **Reseed Categories**:
   ```bash
   cd backend
   npm run reseed:categories
   ```

2. **Update Existing Foods** (if any):
   - Go to Admin Menu
   - Edit each food item
   - Reassign to appropriate spice level

3. **Add New Foods**:
   - Use the admin panel to add foods
   - Select appropriate spice level category

## 📊 Category Structure

```
Spice Level 1 (Mild)
├── Food items with mild spice
└── Description: Perfect for those who prefer gentle flavors

Spice Level 2 (Medium)
├── Food items with medium spice
└── Description: Balanced heat with great flavor

Spice Level 3 (Hot)
├── Food items with hot spice
└── Description: For spice lovers who enjoy intense flavors
```

---

**Categories are now updated to Spice Levels! Run `npm run reseed:categories` to update your database.** 🎉

