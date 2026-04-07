const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { getDeliveryChargeForDistanceKm } = require('../utils/pricing');
const {
  geocodeAddressToLatLng,
  distanceMatrixMeters,
  getGoogleMapsApiKey,
  reverseGeocodeLatLngToAddress
} = require('../utils/googleMaps');

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
        const { address, location } = req.body;

        // Optional: keep a friendly test response if key isn't configured
        if (!getGoogleMapsApiKey()) {
            console.warn('Google Maps API Key not set. Using fallback logic.');
            return res.json({
                distance: "1.5 km",
                distanceValue: 1500,
                distanceKm: 1.5,
                deliveryCharge: 30,
                isDeliverable: true,
                message: "Test mode: API key missing",
                deliveryFee: 30,
                available: true
            });
        }

        let destLat;
        let destLng;

        // Option 1: lat/lng directly (auto location)
        const lat = Number(location?.lat ?? location?.latitude);
        const lng = Number(location?.lng ?? location?.longitude);
        const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
        let resolvedAddress = null;

        if (hasCoords) {
            destLat = lat;
            destLng = lng;
            // Try to resolve a human-readable address for autofill.
            try {
                resolvedAddress = await reverseGeocodeLatLngToAddress(destLat, destLng);
            } catch (e) {
                console.warn('Reverse geocode failed for current location:', e.message);
            }
        } else {
            // Option 2: address string/object (manual input)
            if (!address) {
                return res.status(400).json({ message: 'Provide either address or location (lat/lng).' });
            }

            const addressText =
                typeof address === 'string'
                    ? address
                    : [address.fullAddress, address.area, address.city, address.pincode].filter(Boolean).join(' ');

            if (!addressText || addressText.trim().length < 6) {
                return res.status(400).json({ message: 'Invalid address. Please enter a full address.' });
            }

            const coords = await geocodeAddressToLatLng(addressText);
            destLat = coords.lat;
            destLng = coords.lng;
        }

        // Road distance via Distance Matrix API
        const { distanceText, distanceValue } = await distanceMatrixMeters(SHOP_LAT, SHOP_LNG, destLat, destLng);
        const distanceKm = distanceValue / 1000;
        const { allowed, deliveryCharge } = getDeliveryChargeForDistanceKm(distanceKm);
        const roundedDistanceKm = Number(distanceKm.toFixed(2));
        const message = allowed
            ? 'Delivery available'
            : 'Delivery not available. Location is outside 15 km radius from the shop.';

        res.json({
            distance: distanceText,
            distanceValue,
            distanceKm: roundedDistanceKm,
            deliveryCharge,
            isDeliverable: allowed,
            message,
            // Backward-compatible keys for existing UI parts
            deliveryFee: deliveryCharge,
            available: allowed,
            resolvedAddress
        });

    } catch (error) {
        console.error('Delivery calculation error:', error);
        if (error?.code === 'GEOCODE_FAILED') {
            return res.status(400).json({ message: 'Invalid address. Could not calculate distance.' });
        }
        if (error?.code === 'DISTANCE_MATRIX_FAILED') {
            return res.status(400).json({ message: 'Could not calculate distance to this location.' });
        }
        if (error?.code === 'NO_GOOGLE_MAPS_KEY') {
            return res.status(500).json({ message: 'Google Maps API is not configured.' });
        }
        res.status(500).json({ message: 'Error calculating delivery fee' });
    }
});

module.exports = router;
