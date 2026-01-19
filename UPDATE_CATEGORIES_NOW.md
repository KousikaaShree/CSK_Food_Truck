# 🔥 Update Categories to Spice Levels - QUICK GUIDE

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

🧹 Cleaned up any existing spice level categories

📝 Creating new spice level categories...

  ✅ Created: Spice Level 1
  ✅ Created: Spice Level 2
  ✅ Created: Spice Level 3

🎉 Success! Total categories in database: 3

Your categories are now:
  1. Spice Level 1
  2. Spice Level 2
  3. Spice Level 3
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
   - Spice Level 1
   - Spice Level 2
   - Spice Level 3

## 📝 What This Script Does

1. ✅ Connects to MongoDB
2. ✅ Deletes old categories (Biryani, Momos, Wraps, etc.)
3. ✅ Cleans up any existing spice levels (to avoid duplicates)
4. ✅ Creates the 3 new spice level categories
5. ✅ Shows you the final result

## ⚠️ Important Notes

- **Backend server must be stopped** when running this script
- **Existing foods**: If you have foods assigned to old categories, you'll need to reassign them to spice levels in the admin panel
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

1. **Backend**: Check terminal output shows 3 categories created
2. **Admin Panel**: Category dropdown shows spice levels
3. **User Website**: Home page filters show spice levels

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

