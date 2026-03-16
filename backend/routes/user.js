const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authenticateUser } = require('../middleware/auth');
const User = require('../models/User');
const Food = require('../models/Food');

// Get current user's extended profile (addresses, favourites)
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('favourites', 'name description price image available categoryName');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update basic profile fields (name/mobile)
router.put('/me', authenticateUser, async (req, res) => {
  try {
    const { name, mobile } = req.body || {};
    const updates = {};
    if (typeof name === 'string') updates.name = name.trim();
    if (typeof mobile === 'string') updates.mobile = mobile.trim();

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// FAVOURITES
router.get('/favourites', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favourites', 'name description price image available categoryName');
    res.json({ favourites: user?.favourites || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/favourites/:foodId', authenticateUser, async (req, res) => {
  try {
    const { foodId } = req.params;
    if (!mongoose.isValidObjectId(foodId)) {
      return res.status(400).json({ message: 'Invalid food id' });
    }

    const exists = await Food.exists({ _id: foodId });
    if (!exists) return res.status(404).json({ message: 'Food not found' });

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { favourites: foodId } });
    const user = await User.findById(req.user._id).populate('favourites', 'name description price image available categoryName');
    res.json({ favourites: user?.favourites || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/favourites/:foodId', authenticateUser, async (req, res) => {
  try {
    const { foodId } = req.params;
    if (!mongoose.isValidObjectId(foodId)) {
      return res.status(400).json({ message: 'Invalid food id' });
    }

    await User.findByIdAndUpdate(req.user._id, { $pull: { favourites: foodId } });
    const user = await User.findById(req.user._id).populate('favourites', 'name description price image available categoryName');
    res.json({ favourites: user?.favourites || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ADDRESSES
router.get('/addresses', authenticateUser, async (req, res) => {
  res.json({ addresses: req.user.addresses || [] });
});

router.post('/addresses', authenticateUser, async (req, res) => {
  try {
    const { label, fullAddress, city, area, pincode, mobile } = req.body || {};
    const address = {
      label: label || 'Home',
      fullAddress: fullAddress || '',
      city: city || '',
      area: area || '',
      pincode: pincode || '',
      mobile: mobile || req.user.mobile || ''
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { addresses: address } },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(201).json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/addresses/:addressId', authenticateUser, async (req, res) => {
  try {
    const { addressId } = req.params;
    const { label, fullAddress, city, area, pincode, mobile } = req.body || {};

    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    if (label) addr.label = label;
    if (fullAddress !== undefined) addr.fullAddress = fullAddress;
    if (city !== undefined) addr.city = city;
    if (area !== undefined) addr.area = area;
    if (pincode !== undefined) addr.pincode = pincode;
    if (mobile !== undefined) addr.mobile = mobile;

    await user.save();
    res.json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/addresses/:addressId', authenticateUser, async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    addr.deleteOne();
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

