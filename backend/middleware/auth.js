const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Admin model is now deprecated in favor of User with role: 'admin'

// Unified Token Verification Middleware
exports.verifyToken = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token || token === 'null' || token === 'undefined') {
      console.log("Auth Error: Missing or invalid token string:", token);
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    if (!process.env.JWT_SECRET) {
      console.error("CRITICAL: JWT_SECRET is missing from process.env");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth Success: Decoded payload:", decoded);
    req.user = decoded; // Contains { id, role }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin Role Mandatory Middleware
exports.requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access denied. Admin role required.' });
  }
};

// User authentication middleware (Backward Compatibility)
exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.userId;
    console.log("AuthenticateUser: Searching for User ID:", userId);
    const user = await User.findById(userId).select('-password');

    if (!user) {
      console.log("AuthenticateUser: User not found for ID:", userId);
      return res.status(401).json({ message: 'User associated with this token no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("authenticateUser error:", error.message);
    res.status(401).json({ message: 'Authentication failed: ' + error.message });
  }
};

// Admin authentication middleware (Backward Compatibility)
exports.authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Support both old 'adminId' and new 'id'
    const adminId = decoded.id || decoded.adminId;
    const admin = await User.findById(adminId).select('-password');

    if (!admin || admin.role !== 'admin') {
      return res.status(401).json({ message: 'Admin access denied' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

