# 🔧 Troubleshoot: Category Dropdown Not Showing

## Problem
The category dropdown is empty in the admin panel, so you can't create food items.

## ✅ Solution Steps

### Step 1: Check if Categories Exist in Database

**Run this command in backend folder:**
```bash
cd backend
npm run update:categories
```

**Expected Output:**
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
```

### Step 2: Verify Backend Server is Running

Make sure your backend server is running:
```bash
cd backend
npm run dev
```

You should see: `Server running on port 5000`

### Step 3: Check Browser Console

1. Open Admin Panel: http://localhost:3000/admin/menu
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Click "Add Food Item"
5. Look for any error messages
6. You should see: `Categories fetched: [...]` with 3 items

### Step 4: Check Network Tab

1. In Developer Tools, go to Network tab
2. Click "Add Food Item"
3. Look for request to `/api/admin/categories`
4. Check if it returns 200 status
5. Check Response - should show 3 categories

### Step 5: Verify Admin Token

Make sure you're logged in as admin:
1. Check if you can access admin dashboard
2. If not, login at: http://localhost:3000/admin/login

## 🔍 Common Issues

### Issue 1: Categories Not Seeded
**Symptom**: Dropdown shows "Select Category" but no options
**Fix**: Run `npm run update:categories` in backend folder

### Issue 2: Backend Not Running
**Symptom**: Network error in console
**Fix**: Start backend server with `npm run dev`

### Issue 3: MongoDB Not Connected
**Symptom**: Error when running seed script
**Fix**: Check `.env` file has correct `MONGODB_URI`

### Issue 4: No Admin Token
**Symptom**: 401 Unauthorized error
**Fix**: Login to admin panel first

## ✅ Quick Checklist

- [ ] Backend server is running
- [ ] MongoDB is connected
- [ ] Categories are seeded (`npm run update:categories`)
- [ ] Logged in as admin
- [ ] Browser console shows categories fetched
- [ ] Network tab shows 200 response for categories API

## 🎯 After Fixing

Once categories are seeded:
1. Refresh the admin menu page
2. Click "Add Food Item"
3. Category dropdown should show:
   - Shawarma
   - Kebab
   - Barbeque
   - Beverages

## 📝 Manual Verification

You can also verify categories exist by checking the database or using this API directly:

```bash
# Using curl (replace YOUR_ADMIN_TOKEN)
curl http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

Should return:
```json
[
  {"_id":"...","name":"Shawarma","description":"..."},
  {"_id":"...","name":"Kebab","description":"..."},
  {"_id":"...","name":"Barbeque","description":"..."},
  {"_id":"...","name":"Beverages","description":"..."}
]
```

---

**If dropdown is still empty after these steps, check browser console for specific error messages.**

