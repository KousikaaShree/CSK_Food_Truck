function getDeliveryChargeForDistanceKm(distanceKm) {
  const km = Number(distanceKm);
  if (!Number.isFinite(km) || km < 0) {
    return { allowed: false, deliveryCharge: 0 };
  }

  // Slabs (km):
  // 0-10   => ₹30
  // >10-15 => ₹50
  // >15    => not deliverable
  if (km <= 10) return { allowed: true, deliveryCharge: 30 };
  if (km <= 15) return { allowed: true, deliveryCharge: 50 };
  return { allowed: false, deliveryCharge: 0 };
}

function calculateFinalTotal(itemsTotal, deliveryCharge) {
  const items = Number(itemsTotal) || 0;
  const delivery = Number(deliveryCharge) || 0;
  return items + delivery;
}

module.exports = {
  getDeliveryChargeForDistanceKm,
  calculateFinalTotal
};

