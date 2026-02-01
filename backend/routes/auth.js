const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateUser } = require('../middleware/auth');
// Admin model is now deprecated in favor of User with role: 'admin'
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (userId, role = 'user') => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// User Signup
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('mobile').trim().notEmpty().withMessage('Mobile number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, mobile, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = new User({ name, email, mobile, password });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Login
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin Signup
router.post('/admin/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    let admin = await User.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: 'User/Admin already exists' });
    }

    admin = new User({ name, email, password, mobile: 'Admin', role: 'admin' });
    await admin.save();

    const token = generateToken(admin._id, 'admin');
    res.status(201).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin Login
router.post('/admin/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials or not an admin' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id, 'admin');
    res.json({
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Google User Login/Signup
router.post('/google/user', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'Google ID Token is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload();

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // Create new user (mobile is required in schema, so we'll use a placeholder or handle it)
      // Note: Since mobile is required, we might need to prompt for it later or make it optional in schema
      user = new User({
        name,
        email,
        mobile: 'Not Provided',
        password: Math.random().toString(36).slice(-10),
        role: 'user' // Explicitly set role
      });
      await user.save();
    }

    const token = generateToken(user._id, 'user');
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        picture
      }
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Invalid Google Token', error: error.message });
  }
});

// Google Admin Login (Restricted)
router.post('/google/admin', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'Google ID Token is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email } = ticket.getPayload();

    // STRICT AUTHORIZATION: Only kousikaashree.6607@gmail.com is allowed
    const AUTHORIZED_ADMIN_EMAIL = 'kousikaashree.6607@gmail.com';

    if (email !== AUTHORIZED_ADMIN_EMAIL) {
      return res.status(403).json({ message: 'You are not authorized to access admin dashboard' });
    }

    // Double check in database to ensure role-based consistency
    // Double check in database to ensure role-based consistency
    // We now look in the 'User' collection as per unified architecture
    let admin = await User.findOne({ email });

    if (admin) {
      // If user exists but isn't marked as admin, promote them (since email is authorized)
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
      }
    } else {
      // If no user record exists yet, create it
      admin = new User({
        name: 'Admin',
        email: email,
        mobile: 'Admin',
        password: Math.random().toString(36).slice(-10),
        role: 'admin'
      });
      await admin.save();
    }

    const token = generateToken(admin._id, 'admin');
    res.json({
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Google Admin Auth Error:', error);
    res.status(401).json({ message: 'Invalid Google Token', error: error.message });
  }
});

// Get user profile (and verify token)
router.get('/me', authenticateUser, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;

