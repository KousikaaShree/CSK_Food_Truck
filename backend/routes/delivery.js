const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateUser } = require('../middleware/auth');
const { getDeliveryChargeForDistanceKm } = require('../utils/pricing');

// Shop Coordinates (Theni, Tamil Nadu)
// These can be moved to .env for production
const SHOP_LAT = process.env.SHOP_LAT || 10.0104;
const SHOP_LNG = process.env.SHOP_LNG || 77.4768;

/**
 * @route   POST /api/delivery/calculate
 * @desc    Calculate distance and delivery fee
 * @access  Private
 */
router.post('/calculate', authenticateUser, async (req, res) => {
    try {
        const { address } = req.body;
        
        if (!address || !address.fullAddress) {
            return res.status(400).json({ message: 'Address is required' });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
            // Placeholder logic if API key isn't set (for testing)
            console.warn('Google Maps API Key not set. Using fallback logic.');
            return res.json({
                distance: "5.0 km",
                distanceValue: 5000,
                deliveryFee: 30,
                available: true,
                message: "Test mode: API key missing"
            });
        }

        // 1. Geocode the address to get coordinates
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address.fullAddress + ' ' + address.city)}&key=${apiKey}`;
        const geocodeRes = await axios.get(geocodeUrl);

        if (geocodeRes.data.status !== 'OK') {
            return res.status(400).json({ message: 'Invalid address. Could not calculate distance.' });
        }

        const destLat = geocodeRes.data.results[0].geometry.location.lat;
        const destLng = geocodeRes.data.results[0].geometry.location.lng;

        // 2. Calculate distance using Distance Matrix API
        const distUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${SHOP_LAT},${SHOP_LNG}&destinations=${destLat},${destLng}&key=${apiKey}`;
        const distRes = await axios.get(distUrl);

        if (distRes.data.status !== 'OK' || distRes.data.rows[0].elements[0].status !== 'OK') {
            return res.status(400).json({ message: 'Could not calculate distance to this location.' });
        }

        const distanceText = distRes.data.rows[0].elements[0].distance.text;
        const distanceValue = distRes.data.rows[0].elements[0].distance.value; // In meters
        const distanceKm = distanceValue / 1000;

        const { allowed, deliveryCharge } = getDeliveryChargeForDistanceKm(distanceKm);

        res.json({
            distance: distanceText,
            distanceValue: distanceValue,
            deliveryFee: deliveryCharge,
            available: allowed
        });

    } catch (error) {
        console.error('Delivery calculation error:', error);
        res.status(500).json({ message: 'Error calculating delivery fee' });
    }
});

module.exports = router;
