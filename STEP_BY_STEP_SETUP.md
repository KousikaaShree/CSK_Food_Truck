# Step-by-Step Setup Guide - CSK Food Truck

Follow these steps in order to set up and run the application.

---

## STEP 1: Install Backend Dependencies

**Location**: `backend` folder

```bash
cd backend
npm install
```

**Expected Output**: 
- Node modules will be installed
- Should see "added X packages" message
- No errors should occur

**Troubleshooting**:
- If you get errors, try: `npm cache clean --force` then `npm install` again
- Ensure Node.js version is 16 or higher: `node --version`

---

## STEP 2: Install Frontend Dependencies

**Location**: `frontend` folder

```bash
cd ../frontend
npm install
```

**Expected Output**:
- Node modules will be installed
- Should see "added X packages" message
- No errors should occur

**Troubleshooting**:
- Same as backend - clear cache if needed

---

## STEP 3: Set Up MongoDB Atlas

### 3.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" or "Sign Up"
3. Create your account

### 3.2 Create a Cluster
1. After login, click "Build a Database"
2. Choose "FREE" (M0) tier
3. Select a cloud provider and region (choose closest to you)
4. Click "Create Cluster"
5. Wait 3-5 minutes for cluster to be created

### 3.3 Get Connection String
1. Click "Connect" button on your cluster
2. Choose "Connect your application"
3. Select "Node.js" and version "5.5 or later"
4. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
5. Replace `<password>` with your database user password (you'll create this next)

### 3.4 Create Database User
1. In the "Connect" dialog, go to "Database Access" tab
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username and password (SAVE THIS PASSWORD!)
5. Set privileges to "Atlas admin" or "Read and write to any database"
6. Click "Add User"

### 3.5 Whitelist Your IP
1. In "Network Access" section
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development) or add your current IP
4. Click "Confirm"

### 3.6 Update Connection String
- Replace `<password>` in the connection string with your actual password
- Add database name at the end: `...mongodb.net/csk-food-truck?retryWrites=true&w=majority`

**Your final connection string should look like:**
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/csk-food-truck?retryWrites=true&w=majority
```

---

## STEP 4: Set Up Razorpay Account

### 4.1 Create Razorpay Account
1. Go to https://razorpay.com/
2. Click "Sign Up" or "Login"
3. Complete registration

### 4.2 Get API Keys
1. After login, go to Dashboard
2. Click on "Settings" → "API Keys"
3. Click "Generate Test Key" (for development)
4. Copy the "Key ID" and "Key Secret"
5. Save these - you'll need them in .env files

**Note**: For production, use "Live Keys" instead of test keys

---

## STEP 5: Set Up Cloudinary Account

### 5.1 Create Cloudinary Account
1. Go to https://cloudinary.com/
2. Click "Sign Up for Free"
3. Complete registration

### 5.2 Get API Credentials
1. After login, you'll see the Dashboard
2. Copy these three values:
   - **Cloud Name** (visible on dashboard)
   - **API Key** (click "Reveal" if hidden)
   - **API Secret** (click "Reveal" if hidden)
3. Save these - you'll need them in backend .env

---

## STEP 6: Set Up Google Maps API

### 6.1 Create Google Cloud Account
1. Go to https://console.cloud.goo     1  gle.com/
2. Sign in with your Google account
3. Create a new project (or select existing)
   - Click "Select a project" → "New Project"
   - Enter project name: "CSK Food Truck"
   - Click "Create"

### 6.2 Enable Maps JavaScript API
1. In the project, go to "APIs & Services" → "Library"
2. Search for "Maps JavaScript API"
3. Click on it and click "Enable"
4. Wait for it to enable (may take a minute)

### 6.3 Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key that appears
4. (Optional) Click "Restrict Key" to add restrictions:
   - Application restrictions: HTTP referrers
   - Add: `http://localhost:3000/*` and `http://localhost:3000`
   - API restrictions: Restrict to "Maps JavaScript API"
5. Click "Save"

**Note**: Google requires billing to be enabled, but they provide $200 free credit monthly

---

## STEP 7: Create Backend .env File

**Location**: `backend` folder

1. Copy the example file:
   ```bash
   cd backend
   copy .env.example .env
   ```
   (On Mac/Linux: `cp .env.example .env`)

2. Open `.env` file in a text editor

3. Fill in the values:

```env
PORT=5000
NODE_ENV=development

# MongoDB - Use your connection string from Step 3
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/csk-food-truck?retryWrites=true&w=majority

# JWT Secret - Generate a random string (min 32 characters)
# You can use: https://randomkeygen.com/ or any random string
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_12345

# Razorpay - From Step 4
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here

# Cloudinary - From Step 5
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

4. Save the file

**Important**: 
- Replace ALL placeholder values with your actual credentials
- Don't share this file or commit it to git
- Keep it secure

---

## STEP 8: Create Frontend .env File

**Location**: `frontend` folder

1. Copy the example file:
   ```bash
   cd ../frontend
   copy .env.example .env
   ```
   (On Mac/Linux: `cp .env.example .env`)

2. Open `.env` file in a text editor

3. Fill in the values:

```env
# Razorpay Key ID (same as backend)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# Google Maps API Key from Step 6
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

4. Save the file

---

## STEP 9: Seed Initial Categories

**Location**: `backend` folder

```bash
cd ../backend
npm run seed:categories
```

**Expected Output**:
```
Connected to MongoDB
Created category: Biryani
Created category: Momos
Created category: Wraps
Created category: Burgers
Created category: Dosa
Created category: Juice
Categories seeded successfully
```

**Troubleshooting**:
- If you get connection error, check your MONGODB_URI in .env
- Ensure MongoDB Atlas IP whitelist includes your IP
- Check if password in connection string is correct

---

## STEP 10: Start Backend Server

**Location**: `backend` folder**

```bash
npm run dev
```

**Expected Output**:
```
MongoDB Connected
Server running on port 5000
```

**Keep this terminal window open!**

**Troubleshooting**:
- If port 5000 is in use, change PORT in .env
- If MongoDB connection fails, check your connection string
- Check for any error messages

---

## STEP 11: Start Frontend Server

**Open a NEW terminal window** (keep backend running)

**Location**: `frontend` folder

```bash
cd frontend
npm run dev
```

**Expected Output**:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Keep this terminal window open too!**

**Troubleshooting**:
- If port 3000 is in use, Vite will suggest another port
- Check for any error messages
- Ensure backend is running first

---

## STEP 12: Create Admin Account

### Option A: Using Browser (Easiest)

1. Open browser and go to: httpc://localhost:3000/admin/login
2. You'll see the login page
3. But first, we need to create an admin account

### Option B: Using API (Recommended)

**Using Postman or curl:**

**Postman Method:**
1. Open Postman
2. Create new POST request
3. URL: `http://localhost:5000/api/auth/admin/signup`
4. Headers: 
   - Key: `Content-Type`
   - Value: `application/json`
5. Body (raw JSON):
```json
{
  "name": "Admin",
  "email": "admin@cskfoodtruck.com",
  "password": "admin123"
}
```
6. Click "Send"
7. You should get a response with token and admin details

**Using curl (Terminal):**
```bash
curl -X POST http://localhost:5000/api/auth/admin/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin\",\"email\":\"admin@cskfoodtruck.com\",\"password\":\"admin123\"}"
```

**Expected Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "name": "Admin",
    "email": "admin@cskfoodtruck.com"
  }
}
```

**Save the email and password you used!**

---

## STEP 13: Access the Application

### User Website
1. Open browser: http://localhost:3000
2. You should see the home page
3. Click "Sign Up" to create a user account
4. After signup, you can browse foods and add to cart

### Admin Panel
1. Go to: http://localhost:3000/admin/login
2. Login with admin credentials from Step 12
3. You'll see the admin dashboard
4. Go to "Menu" to add food items
5. Go to "Orders" to manage orders

---

## STEP 14: Add Your First Food Item (Admin)

1. Login to admin panel: http://localhost:3000/admin/login
2. Click "Menu" or go to: http://localhost:3000/admin/menu
3. Click "Add Food Item" button
4. Fill in the form:
   - Name: e.g., "Chicken Biryani"
   - Description: e.g., "Delicious aromatic biryani with tender chicken"
   - Price: e.g., "250"
   - Category: Select "Biryani"
   - Image: Upload a food image
   - Available: Checked
   - Popular: Optional
5. Click "Create"
6. The item should appear in the list

**Repeat for more items!**

---

## STEP 15: Test Complete Flow

### User Flow:
1. **Sign Up**: http://localhost:3000/signup
   - Create a user account
   
2. **Browse Foods**: http://localhost:3000
   - See food items
   - Filter by category
   
3. **Add to Cart**: 
   - Click "Add" on any food item
   - Cart icon shows item count
   
4. **View Cart**: http://localhost:3000/cart
   - See items in cart
   - Update quantities
   - Remove items
   
5. **Checkout**: http://localhost:3000/checkout
   - Fill delivery address
   - Choose payment method
   - Place order
   
6. **Order Confirmation**: 
   - See order ID and details
   
7. **Dashboard**: http://localhost:3000/dashboard
   - View order history
   - Track order status

### Admin Flow:
1. **Login**: http://localhost:3000/admin/login
2. **Dashboard**: See statistics
3. **Menu Management**: Add/edit/delete foods
4. **Orders**: View all orders, update status, assign delivery

---

## ✅ Verification Checklist

- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] MongoDB Atlas connected
- [ ] Backend .env file created and filled
- [ ] Frontend .env file created and filled
- [ ] Categories seeded successfully
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Admin account created
- [ ] Can access user website
- [ ] Can access admin panel
- [ ] Can add food items (admin)
- [ ] Can place orders (user)

---

## 🆘 Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution**: 
- Check connection string in .env
- Verify password is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network access is allowed

### Issue: "Port already in use"
**Solution**:
- Change PORT in backend/.env
- Or kill the process using the port
- Windows: `netstat -ano | findstr :5000` then `taskkill /PID <pid> /F`
- Mac/Linux: `lsof -ti:5000 | xargs kill`

### Issue: "Razorpay payment not working"
**Solution**:
- Verify keys in both backend and frontend .env
- Use test keys for development
- Check browser console for errors

### Issue: "Images not uploading"
**Solution**:
- Verify Cloudinary credentials
- Check file size (max 5MB)
- Ensure uploads directory exists (auto-created)

### Issue: "Google Maps not loading"
**Solution**:
- Verify API key in frontend .env
- Check if Maps JavaScript API is enabled
- Verify billing is enabled (free tier OK)

---

## 🎉 Success!

If all steps completed successfully, your application is now running!

**Next Steps**:
1. Add more food items through admin panel
2. Create delivery partners (via API or add to admin panel)
3. Test the complete order flow
4. Customize the UI if needed

**Need Help?** Check the main README.md for detailed documentation.

