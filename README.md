# CSK Food Truck - Full-Stack Food Ordering Application

A production-ready MERN stack food ordering web application with user and admin panels, payment integration, and live order tracking.

## 🚀 Features

### User Features
- **Food Browsing**: Browse food items by categories (Biryani, Momos, Wraps, Burgers, Dosa, Juice, etc.)
- **Shopping Cart**: Add items, update quantities, and remove items
- **Authentication**: Secure JWT-based user authentication
- **Checkout**: Multiple payment options (Razorpay & Cash on Delivery)
- **Order Tracking**: Real-time order status updates
- **Live Tracking**: Google Maps integration for delivery tracking
- **User Dashboard**: View order history and track deliveries

### Admin Features
- **Menu Management**: Add, update, and delete food items
- **Image Uploads**: Cloudinary integration for food images
- **Order Management**: View all orders, update status, assign delivery partners
- **Dashboard Analytics**: Total orders, revenue, today's orders, popular items
- **Delivery Partner Management**: Assign and track delivery partners

## 🛠️ Tech Stack

- **Frontend**: React.js + Tailwind CSS + Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas + Mongoose
- **Authentication**: JWT + bcrypt
- **Payments**: Razorpay
- **Maps**: Google Maps API
- **Image Storage**: Cloudinary
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Razorpay account
- Cloudinary account
- Google Maps API key

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "CSK FOOD TRUCK"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔑 API Configuration

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` with your database password
5. Add your IP address to the whitelist

### Razorpay Setup
1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your Key ID and Key Secret from the dashboard
3. Add them to both backend and frontend `.env` files

### Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret
3. Add them to the backend `.env` file

### Google Maps API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Maps JavaScript API
4. Create an API key
5. Add it to the frontend `.env` file

## 📁 Project Structure

```
CSK FOOD TRUCK/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── utils/           # Utility functions
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context API
│   │   └── App.jsx      # Main app component
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🗄️ Database Models

- **User**: User authentication and profile
- **Admin**: Admin authentication
- **Category**: Food categories
- **Food**: Food items with images and pricing
- **Cart**: User shopping cart
- **Order**: Order details and status
- **Delivery**: Delivery partner information

## 🔐 Authentication

### User Authentication
- Signup: `/api/auth/signup`
- Login: `/api/auth/login`

### Admin Authentication
- Admin Signup: `/api/auth/admin/signup`
- Admin Login: `/api/auth/admin/login`

All protected routes require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 📱 API Endpoints

### Food Endpoints
- `GET /api/foods` - Get all foods
- `GET /api/foods/:id` - Get single food
- `GET /api/foods/categories` - Get all categories

### Cart Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update item quantity
- `DELETE /api/cart/remove/:foodId` - Remove item
- `DELETE /api/cart/clear` - Clear cart

### Order Endpoints
- `POST /api/orders/create` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order

### Payment Endpoints
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify-payment` - Verify payment

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/foods` - Get all foods
- `POST /api/admin/foods` - Create food item
- `PUT /api/admin/foods/:id` - Update food item
- `DELETE /api/admin/foods/:id` - Delete food item
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `PUT /api/admin/orders/:id/assign-delivery` - Assign delivery partner

## 🧪 Test Credentials

After setting up the application, you can create test accounts:

### Create Admin Account
1. Sign up at `/admin/login` (or use the signup endpoint)
2. Use the admin credentials to access the admin panel

### Create User Account
1. Sign up at `/signup`
2. Use the credentials to place orders

## 🎨 UI Theme

The application uses a soft pastel color scheme with:
- Rounded cards
- Modern minimal UI
- Responsive design
- Smooth transitions

## 🚀 Deployment

### Backend Deployment
1. Deploy to platforms like Heroku, Railway, or Render
2. Set environment variables in the platform's dashboard
3. Ensure MongoDB Atlas allows connections from the deployment IP

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to Vercel, Netlify, or similar
3. Update API URLs in production environment variables

## 📝 Notes

- Ensure all environment variables are set correctly
- MongoDB Atlas connection string should include your database name
- Razorpay test keys can be used for development
- Google Maps API requires billing to be enabled (free tier available)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Support

For issues or questions, please open an issue on the repository.

---

**Built with ❤️ for CSK Food Truck**

