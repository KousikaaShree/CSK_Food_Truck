# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites Check
- [ ] Node.js installed (v16+)
- [ ] MongoDB Atlas account
- [ ] Razorpay account (test mode OK)
- [ ] Cloudinary account
- [ ] Google Maps API key

### Step 1: Backend Setup (2 minutes)

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_random_string_min_32_chars
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

Start backend:
```bash
npm run dev
```

Seed categories:
```bash
npm run seed:categories
```

### Step 2: Frontend Setup (2 minutes)

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

Start frontend:
```bash
npm run dev
```

### Step 3: Create Admin (1 minute)

Open Postman or use curl:

```bash
POST http://localhost:5000/api/auth/admin/signup
Content-Type: application/json

{
  "name": "Admin",
  "email": "admin@test.com",
  "password": "admin123"
}
```

### Step 4: Access Application

- **User Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login

### Step 5: Test Flow

1. **User Side**:
   - Sign up at http://localhost:3000/signup
   - Browse foods
   - Add to cart
   - Checkout
   - Place order

2. **Admin Side**:
   - Login at http://localhost:3000/admin/login
   - Go to Menu Management
   - Add food items
   - Go to Orders
   - Update order status

## 🎉 You're Ready!

The application is now running. Start adding food items and processing orders!

## ⚠️ Troubleshooting

**Backend won't start?**
- Check MongoDB connection string
- Ensure all .env variables are set
- Check if port 5000 is available

**Frontend won't start?**
- Check if port 3000 is available
- Verify .env file exists
- Run `npm install` again

**Payment not working?**
- Verify Razorpay keys are correct
- Use test keys for development
- Check browser console for errors

**Images not uploading?**
- Verify Cloudinary credentials
- Check file size (max 5MB)
- Ensure uploads directory exists

---

**Need Help?** Check README.md for detailed documentation.

