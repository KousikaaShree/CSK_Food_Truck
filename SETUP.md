# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/csk-food-truck?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key_here_min_32_characters
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start backend:
```bash
npm run dev
```

Seed initial categories:
```bash
npm run seed:categories
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Start frontend:
```bash
npm run dev
```

### 3. Create Admin Account

Use Postman or curl to create admin:

```bash
curl -X POST http://localhost:5000/api/auth/admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@cskfoodtruck.com",
    "password": "admin123"
  }'
```

### 4. Access the Application

- **User Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login

## Testing the Application

1. **User Flow**:
   - Sign up at `/signup`
   - Browse foods at home page
   - Add items to cart
   - Checkout and place order
   - View orders in dashboard

2. **Admin Flow**:
   - Login at `/admin/login`
   - Add food items in Menu Management
   - View and manage orders
   - Update order status
   - Assign delivery partners

## Important Notes

- Make sure MongoDB Atlas IP whitelist includes your IP
- Razorpay test keys work for development
- Google Maps API requires billing (free tier available)
- Cloudinary free tier is sufficient for development

