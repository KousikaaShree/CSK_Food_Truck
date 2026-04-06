function getDeliveryChargeForDistanceKm(distanceKm) {
  const km = Number(distanceKm);
  if (!Number.isFinite(km) || km < 0) {
    return { allowed: false, deliveryCharge: 0 };
  }

  if (km <= 10) return { allowed: true, deliveryCharge: 30 };
  if (km <= 15) return { allowed: true, deliveryCharge: 50 };
  return { allowed: false, deliveryCharge: 0 };
}

function calculateFinalTotal(itemsTotal, deliveryCharge) {
  const items = Number(itemsTotal) || 0;
  const delivery = Number(deliveryCharge) || 0;
  return items + delivery;
}

// Distance between two lat/lng pairs using the Haversine formula.
// Returns distance in kilometers.
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const φ1 = Number(lat1) * (Math.PI / 180);
  const φ2 = Number(lat2) * (Math.PI / 180);
  const Δφ = (Number(lat2) - Number(lat1)) * (Math.PI / 180);
  const Δλ = (Number(lon2) - Number(lon1)) * (Math.PI / 180);

  // Protect against invalid inputs.
  if (![φ1, φ2, Δφ, Δλ].every(Number.isFinite)) return NaN;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Mean earth radius (km)
  const R = 6371;
  return R * c;
}

module.exports = {
  getDeliveryChargeForDistanceKm,
  calculateFinalTotal,
  haversineDistanceKm
};

