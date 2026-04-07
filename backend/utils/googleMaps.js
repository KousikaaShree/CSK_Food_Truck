const axios = require('axios');

function getGoogleMapsApiKey() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === 'your_google_maps_api_key_here') return null;
  return apiKey;
}

async function geocodeAddressToLatLng(addressText) {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    const err = new Error('Google Maps API key not configured');
    err.code = 'NO_GOOGLE_MAPS_KEY';
    throw err;
  }

  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressText)}&key=${apiKey}`;
  const geocodeRes = await axios.get(geocodeUrl);

  if (geocodeRes.data.status !== 'OK' || !geocodeRes.data.results?.length) {
    const err = new Error('Invalid address. Could not geocode.');
    err.code = 'GEOCODE_FAILED';
    err.details = { status: geocodeRes.data.status, error_message: geocodeRes.data.error_message };
    throw err;
  }

  const loc = geocodeRes.data.results[0].geometry.location;
  return { lat: loc.lat, lng: loc.lng };
}

async function distanceMatrixMeters(originLat, originLng, destLat, destLng) {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    const err = new Error('Google Maps API key not configured');
    err.code = 'NO_GOOGLE_MAPS_KEY';
    throw err;
  }

  const distUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&key=${apiKey}`;
  const distRes = await axios.get(distUrl);

  const element = distRes.data?.rows?.[0]?.elements?.[0];
  if (distRes.data?.status !== 'OK' || element?.status !== 'OK') {
    const err = new Error('Could not calculate distance to this location.');
    err.code = 'DISTANCE_MATRIX_FAILED';
    err.details = { status: distRes.data?.status, element_status: element?.status, error_message: distRes.data?.error_message };
    throw err;
  }

  return {
    distanceText: element.distance.text,
    distanceValue: element.distance.value // meters
  };
}

async function reverseGeocodeLatLngToAddress(lat, lng) {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    const err = new Error('Google Maps API key not configured');
    err.code = 'NO_GOOGLE_MAPS_KEY';
    throw err;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  const res = await axios.get(url);

  if (res.data.status !== 'OK' || !res.data.results?.length) {
    const err = new Error('Could not reverse geocode coordinates.');
    err.code = 'REVERSE_GEOCODE_FAILED';
    err.details = { status: res.data.status, error_message: res.data.error_message };
    throw err;
  }

  const result = res.data.results[0];
  const components = result.address_components || [];

  const find = (type) =>
    components.find((c) => c.types && c.types.includes(type));

  const streetNumber = find('street_number')?.long_name || '';
  const route = find('route')?.long_name || '';
  // Fallback city names for areas where "locality" is absent.
  const city =
    find('locality')?.long_name ||
    find('administrative_area_level_2')?.long_name ||
    find('administrative_area_level_1')?.long_name ||
    '';
  const sublocality =
    find('sublocality_level_1')?.long_name ||
    find('sublocality')?.long_name ||
    find('neighborhood')?.long_name ||
    '';
  const postalCode = find('postal_code')?.long_name || '';

  const fullAddress =
    result.formatted_address ||
    [streetNumber, route, sublocality, locality, postalCode].filter(Boolean).join(', ');

  return {
    fullAddress,
    city,
    area: sublocality || city,
    pincode: postalCode
  };
}

module.exports = {
  getGoogleMapsApiKey,
  geocodeAddressToLatLng,
  distanceMatrixMeters,
  reverseGeocodeLatLngToAddress
};

