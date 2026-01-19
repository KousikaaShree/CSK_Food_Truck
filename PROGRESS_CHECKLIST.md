# Setup Progress Checklist

## ✅ Completed Steps

- [x] **Step 1**: Install Backend Dependencies
  - ✅ `cd backend && npm install` - COMPLETED
  - ✅ 169 packages installed

- [x] **Step 2**: Install Frontend Dependencies  
  - ✅ `cd frontend && npm install` - COMPLETED
  - ✅ 164 packages installed

---

## 📋 Next Steps (Follow in Order)

### Step 3: Set Up MongoDB Atlas
- [ ] Create account at https://www.mongodb.com/cloud/atlas
- [ ] Create a free cluster (M0)
- [ ] Create database user (username + password)
- [ ] Whitelist your IP address
- [ ] Get connection string
- [ ] Format: `mongodb+srv://user:pass@cluster.mongodb.net/csk-food-truck?retryWrites=true&w=majority`

**Time Required**: 5-10 minutes

---

### Step 4: Set Up Razorpay
- [ ] Create account at https://razorpay.com/
- [ ] Go to Dashboard → Settings → API Keys
- [ ] Generate Test Key
- [ ] Copy Key ID and Key Secret

**Time Required**: 3-5 minutes

---

### Step 5: Set Up Cloudinary
- [ ] Create account at https://cloudinary.com/
- [ ] Copy from Dashboard:
  - Cloud Name
  - API Key
  - API Secret

**Time Required**: 2-3 minutes

---

### Step 6: Set Up Google Maps API
- [ ] Go to https://console.cloud.google.com/
- [ ] Create new project
- [ ] Enable "Maps JavaScript API"
- [ ] Create API Key
- [ ] (Optional) Restrict key for security

**Time Required**: 5-7 minutes

---

### Step 7: Create Backend .env File
- [ ] Copy `backend/env.example` to `backend/.env`
- [ ] Fill in all values:
  - MongoDB connection string
  - JWT secret (random 32+ char string)
  - Razorpay keys
  - Cloudinary credentials

**Command**:
```bash
cd backend
copy env.example .env
```
Then edit `.env` with your credentials.

---

### Step 8: Create Frontend .env File
- [ ] Copy `frontend/env.example` to `frontend/.env`
- [ ] Fill in:
  - Razorpay Key ID
  - Google Maps API Key

**Command**:
```bash
cd frontend
copy env.example .env
```
Then edit `.env` with your credentials.

---

### Step 9: Seed Categories
- [ ] Run: `cd backend && npm run seed:categories`
- [ ] Should see: "Categories seeded successfully"

**Expected Output**:
```
Connected to MongoDB
Created category: Biryani
Created category: Momos
...
Categories seeded successfully
```

---

### Step 10: Start Backend Server
- [ ] Open terminal
- [ ] Run: `cd backend && npm run dev`
- [ ] Should see: "MongoDB Connected" and "Server running on port 5000"
- [ ] **Keep this terminal open!**

---

### Step 11: Start Frontend Server
- [ ] Open NEW terminal (keep backend running)
- [ ] Run: `cd frontend && npm run dev`
- [ ] Should see: "Local: http://localhost:3000/"
- [ ] **Keep this terminal open!**

---

### Step 12: Create Admin Account

**Option A - Using Postman:**
1. Open Postman
2. POST request to: `http://localhost:5000/api/auth/admin/signup`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "name": "Admin",
  "email": "admin@cskfoodtruck.com",
  "password": "admin123"
}
```
5. Click Send
6. Save the response (contains token)

**Option B - Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/admin/signup -H "Content-Type: application/json" -d "{\"name\":\"Admin\",\"email\":\"admin@test.com\",\"password\":\"admin123\"}"
```

---

### Step 13: Access Application

- [ ] **User Website**: Open http://localhost:3000
- [ ] **Admin Panel**: Open http://localhost:3000/admin/login
- [ ] Login with admin credentials from Step 12

---

### Step 14: Add First Food Item (Admin)

1. [ ] Login to admin panel
2. [ ] Click "Menu" or go to http://localhost:3000/admin/menu
3. [ ] Click "Add Food Item"
4. [ ] Fill form:
   - Name: "Chicken Biryani"
   - Description: "Delicious biryani..."
   - Price: "250"
   - Category: Select "Biryani"
   - Upload image
   - Check "Available"
5. [ ] Click "Create"
6. [ ] Item should appear in list

---

### Step 15: Test User Flow

- [ ] Go to http://localhost:3000
- [ ] Click "Sign Up"
- [ ] Create user account
- [ ] Browse foods
- [ ] Add items to cart
- [ ] Go to cart
- [ ] Proceed to checkout
- [ ] Fill address
- [ ] Choose payment (COD or Razorpay)
- [ ] Place order
- [ ] See order confirmation
- [ ] Check dashboard for order history

---

## 🎯 Quick Reference

### Important URLs:
- User Site: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login
- Backend API: http://localhost:5000

### Default Credentials (After Setup):
- Admin Email: (whatever you set in Step 12)
- Admin Password: (whatever you set in Step 12)

### File Locations:
- Backend .env: `backend/.env`
- Frontend .env: `frontend/.env`
- Example files: `backend/env.example`, `frontend/env.example`

---

## 🆘 Need Help?

1. **Detailed Guide**: See `STEP_BY_STEP_SETUP.md`
2. **Quick Commands**: See `SETUP_COMMANDS.md`
3. **Project Summary**: See `PROJECT_SUMMARY.md`
4. **Main README**: See `README.md`

---

## ✅ Final Verification

Once all steps are complete, verify:
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] Can access user website
- [ ] Can login to admin panel
- [ ] Can add food items
- [ ] Can place orders
- [ ] Orders appear in admin panel

**If all checked, you're ready to go! 🎉**

