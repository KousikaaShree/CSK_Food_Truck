# 🔧 FIX: Update Categories to Spice Levels

## ⚠️ Problem
Your code files are updated, but your **database still has old categories**.

## ✅ Solution: Run This Command

```bash
cd backend
npm run update:categories
```

## 📋 Step-by-Step

### 1. Open Terminal/Command Prompt
Navigate to your project folder

### 2. Stop Backend Server (if running)
Press `Ctrl+C` in the terminal where backend is running

### 3. Run Update Command
```bash
cd backend
npm run update:categories
```

### 4. You Should See:
```
✅ Connected to MongoDB

🗑️  Deleted X old category/categories

🧹 Cleaned up any existing spice level categories

📝 Creating new spice level categories...

  ✅ Created: Spice Level 1
  ✅ Created: Spice Level 2
  ✅ Created: Spice Level 3

🎉 Success! Total categories in database: 3
```

### 5. Start Backend Again
```bash
npm run dev
```

### 6. Check Admin Panel
1. Go to: http://localhost:3000/admin/menu
2. Click "Add Food Item"
3. Look at Category dropdown
4. You should see: Spice Level 1, Spice Level 2, Spice Level 3

## 🎯 What Changed

**Before:**
- Biryani
- Momos
- Wraps
- Burgers
- Dosa
- Juice

**After:**
- ✅ Spice Level 1
- ✅ Spice Level 2
- ✅ Spice Level 3

## 🔍 Verify It Worked

✅ Run the command
✅ See success message
✅ Check admin panel dropdown
✅ See spice levels instead of old categories

---

**Run `npm run update:categories` in the backend folder now!** 🚀

