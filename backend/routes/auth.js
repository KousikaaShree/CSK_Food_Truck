const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { authenticateUser } = require('../middleware/auth');
// Admin model is now deprecated in favor of User with role: 'admin'
const { OAuth2Client } = require('google-auth-library');
const { sendOtpEmail } = require('../utils/sendEmail');

const getGoogleAudiences = () => {
  const raw =
    process.env.GOOGLE_CLIENT_IDS ||
    process.env.GOOGLE_CLIENT_ID ||
    '';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const client = new OAuth2Client();

// Admin email allowlist — these emails are automatically assigned the 'admin' role
const ADMIN_EMAILS = [
  'kousikaashree.6607@gmail.com',
  'csktrucktheni@gmail.com'
];

// Generate JWT Token
const generateToken = (userId, role = 'user') => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const OTP_EXPIRES_MS = 5 * 60 * 1000;
const IS_DEV = process.env.NODE_ENV !== 'production';
const OTP_MAX_ATTEMPTS = 5;
// In development, OTP is frequently re-triggered while testing flows.
const OTP_MAX_RESENDS = IS_DEV ? 20 : 3;
const OTP_RESEND_COOLDOWN_MS = IS_DEV ? 3 * 1000 : 30 * 1000;

const hashOtp = (email, otp) => {
  const salt = process.env.JWT_SECRET || 'csk-otp-salt';
  return crypto.createHash('sha256').update(`${email}:${otp}:${salt}`).digest('hex');
};

const generateOtpCode = () => String(Math.floor(100000 + Math.random() * 900000));

const maskEmail = (email) => {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  const prefix = name.slice(0, 2);
  return `${prefix}${'*'.repeat(Math.max(1, name.length - 2))}@${domain}`;
};

const issueOtpForUser = async (user, purpose) => {
  const now = Date.now();
  const lastSentAt = user.otp?.lastSentAt ? new Date(user.otp.lastSentAt).getTime() : 0;
  if (lastSentAt && now - lastSentAt < OTP_RESEND_COOLDOWN_MS) {
    const waitSeconds = Math.ceil((OTP_RESEND_COOLDOWN_MS - (now - lastSentAt)) / 1000);
    return { ok: false, message: `Please wait ${waitSeconds}s before requesting OTP again.` };
  }

  const resendCount = Number(user.otp?.resendCount || 0);
  if (resendCount >= OTP_MAX_RESENDS) {
    return { ok: false, message: 'OTP request limit reached. Please try again later.' };
  }

  const otp = generateOtpCode();
  user.otp = {
    codeHash: hashOtp(user.email, otp),
    expiresAt: new Date(now + OTP_EXPIRES_MS),
    attempts: 0,
    resendCount: resendCount + 1,
    lastSentAt: new Date(now),
    purpose
  };
  await user.save();

  const sent = await sendOtpEmail({ email: user.email, otp, purpose });
  if (!sent) {
    return { ok: false, message: 'Failed to send OTP email. Please try again.' };
  }
  return { ok: true };
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

    const otpResult = await issueOtpForUser(user, 'signup');
    if (!otpResult.ok) {
      return res.status(429).json({ message: otpResult.message });
    }

    res.status(200).json({
      otpRequired: true,
      purpose: 'signup',
      email: user.email,
      maskedEmail: maskEmail(user.email),
      message: 'OTP sent to your email'
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
    console.log(req.body);

    // Find user
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Auto-detect admin by email allowlist
    const expectedRole = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user';
    if (user.role !== expectedRole) {
      user.role = expectedRole;
      await user.save();
    }

    const otpResult = await issueOtpForUser(user, 'login');
    if (!otpResult.ok) {
      return res.status(429).json({ message: otpResult.message });
    }

    res.status(200).json({
      otpRequired: true,
      purpose: 'login',
      email: user.email,
      maskedEmail: maskEmail(user.email),
      role: user.role,
      message: 'OTP sent to your email'
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

    const audiences = getGoogleAudiences();
    if (audiences.length === 0) {
      return res.status(500).json({
        message:
          'Google OAuth is not configured. Set GOOGLE_CLIENT_IDS or GOOGLE_CLIENT_ID in backend env.',
      });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: audiences,
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload();

    // Auto-detect admin by email allowlist
    const detectedRole = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user';

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        mobile: 'Not Provided',
        password: Math.random().toString(36).slice(-10),
        role: detectedRole
      });
      await user.save();
    } else if (user.role !== detectedRole) {
      user.role = detectedRole;
      await user.save();
    }

    const otpResult = await issueOtpForUser(user, 'login');
    if (!otpResult.ok) {
      return res.status(429).json({ message: otpResult.message });
    }

    res.status(200).json({
      otpRequired: true,
      purpose: 'login',
      email: user.email,
      maskedEmail: maskEmail(user.email),
      role: user.role,
      picture,
      message: 'OTP sent to your email'
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Invalid Google Token', error: error.message });
  }
});

// Verify OTP (for login/signup)
router.post('/verify-otp', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('purpose').isIn(['login', 'signup']).withMessage('Invalid OTP purpose')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, purpose } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.otp || !user.otp.codeHash) {
      return res.status(400).json({ message: 'OTP not found. Please request again.' });
    }

    if (user.otp.purpose !== purpose) {
      return res.status(400).json({ message: 'OTP purpose mismatch. Please request a new OTP.' });
    }

    if (!user.otp.expiresAt || new Date(user.otp.expiresAt).getTime() < Date.now()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
    }

    if ((user.otp.attempts || 0) >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ message: 'Maximum OTP attempts reached. Please resend OTP.' });
    }

    const otpHash = hashOtp(user.email, otp);
    if (otpHash !== user.otp.codeHash) {
      user.otp.attempts = (user.otp.attempts || 0) + 1;
      await user.save();
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // OTP valid: clear OTP state and issue auth token
    user.otp = undefined;
    await user.save();

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Resend OTP
router.post('/resend-otp', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('purpose').isIn(['login', 'signup']).withMessage('Invalid OTP purpose')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, purpose } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const otpResult = await issueOtpForUser(user, purpose);
    if (!otpResult.ok) {
      return res.status(429).json({ message: otpResult.message });
    }

    res.json({
      success: true,
      maskedEmail: maskEmail(user.email),
      message: 'OTP resent successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Google Admin Login (Restricted)
router.post('/google/admin', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'Google ID Token is required' });
    }

    const audiences = getGoogleAudiences();
    if (audiences.length === 0) {
      return res.status(500).json({
        message:
          'Google OAuth is not configured. Set GOOGLE_CLIENT_IDS or GOOGLE_CLIENT_ID in backend env.',
      });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: audiences,
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

