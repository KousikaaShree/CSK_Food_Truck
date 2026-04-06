const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "https://csk-food-truck.vercel.app", 
    "http://localhost:5173",
    "http://localhost:3000",
    "http://cskfoodtruck.nandeesh.fun",
    process.env.FRONTEND_URL // Configure this in AWS EC2 .env to match S3 frontend URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static uploads (fallback when Cloudinary isn't configured)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('CSK Food Truck Backend is Running 🚚');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/foods', require('./routes/foods'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/delivery', require('./routes/delivery'));
app.use('/api/contact', require('./routes/contact'));


// Serve frontend in production
// We'll enable this by default for the deployed version
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  }
});

// Multer (file upload) error handler with friendly messages
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Image too large. Please upload an image under 10MB.' });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/csk-food-truck';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Exit process with failure if DB connection fails in production
    if (process.env.NODE_ENV === 'production') {
      process.exit(1); 
    }
  });

const PORT = process.env.PORT || 5000;

// Listen on 0.0.0.0 so AWS EC2 can map public IP to this port properly
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Proper error handling for server startup issues
server.on('error', (err) => {
  console.error('Server startup error:', err);
});

