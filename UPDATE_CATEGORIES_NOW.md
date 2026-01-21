# 🔥 Update Categories to Food Categories - QUICK GUIDE

## ✅ The Fix is Ready!

Your code files are already updated. Now you just need to **update your database**.

## 🚀 Quick Solution (Run This Now!)

### Step 1: Make sure backend server is NOT running
Stop your backend server if it's running (Ctrl+C in the terminal)

### Step 2: Run the update script
```bash
cd backend
npm run update:categories
```

### Step 3: Expected Output
You should see:
```
✅ Connected to MongoDB

🗑️  Deleted X old category/categories

🧹 Cleaned up any existing food categories

📝 Creating new food categories...

  ✅ Created: Shawarma
  ✅ Created: Kebab
  ✅ Created: Barbeque
  ✅ Created: Beverages

🎉 Success! Total categories in database: 4

Your categories are now:
  1. Barbeque
  2. Beverages
  3. Kebab
  4. Shawarma
```

### Step 4: Restart your backend server
```bash
npm run dev
```

### Step 5: Check in Admin Panel
1. Go to: http://localhost:3000/admin/menu
2. Click "Add Food Item"
3. Check the Category dropdown
4. You should see:
   - Shawarma
   - Kebab
   - Barbeque
   - Beverages

## 📝 What This Script Does

1. ✅ Connects to MongoDB
2. ✅ Deletes old categories (Spice Levels, Biryani, Momos, Wraps, etc.)
3. ✅ Cleans up any existing food categories (to avoid duplicates)
4. ✅ Creates the 4 new food categories
5. ✅ Shows you the final result

## ⚠️ Important Notes

- **Backend server must be stopped** when running this script
- **Existing foods**: If you have foods assigned to old categories, you'll need to reassign them to food categories in the admin panel
- **No data loss**: Only categories are changed, your foods are safe

## 🔄 Alternative: Manual Update

If the script doesn't work, you can also:

1. **Clear all categories and reseed:**
   ```bash
   cd backend
   npm run reseed:categories
   ```

2. **Or just add new categories (keeps old ones):**
   ```bash
   cd backend
   npm run seed:categories
   ```

## ✅ Verification

After running the script, verify:

1. **Backend**: Check terminal output shows 4 categories created
2. **Admin Panel**: Category dropdown shows food categories
3. **User Website**: Home page filters show food categories

---

## 🎯 Quick Command Summary

```bash
# Stop backend server (Ctrl+C if running)

# Update categories
cd backend
npm run update:categories

# Start backend server again
npm run dev

# Done! Check admin panel
```

---

**Run `npm run update:categories` now to update your database!** 🚀

