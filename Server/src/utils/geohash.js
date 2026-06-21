const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

/**
 * Encodes a latitude and longitude into a geohash string.
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {number} precision - Length of the geohash (defaults to 9)
 * @returns {string} Geohash string
 */
function encodeGeohash(latitude, longitude, precision = 9) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Latitude and Longitude must be valid numbers.');
  }

  let minLat = -90, maxLat = 90;
  let minLng = -180, maxLng = 180;
  let geohash = '';
  let isEven = true;
  let bit = 0;
  let ch = 0;

  while (geohash.length < precision) {
    let mid;
    if (isEven) {
      mid = (minLng + maxLng) / 2;
      if (lng > mid) {
        ch = (ch << 1) | 1;
        minLng = mid;
      } else {
        ch = (ch << 1) | 0;
        maxLng = mid;
      }
    } else {
      mid = (minLat + maxLat) / 2;
      if (lat > mid) {
        ch = (ch << 1) | 1;
        minLat = mid;
      } else {
        ch = (ch << 1) | 0;
        maxLat = mid;
      }
    }

    isEven = !isEven;
    if (bit < 4) {
      bit++;
    } else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return geohash;
}

/**
 * Calculates the geohash cell height and width in degrees for a given precision.
 */
function getCellDimensions(precision) {
  const latBits = Math.floor((5 * precision) / 2);
  const lngBits = Math.ceil((5 * precision) / 2);
  return {
    latHeight: 180 / Math.pow(2, latBits),
    lngWidth: 360 / Math.pow(2, lngBits)
  };
}

/**
 * Calculates query ranges for finding documents within a given radius using geohashes.
 */
function getGeohashQueryRanges(latitude, longitude, radiusInKm) {
  let precision = 1;
  if (radiusInKm <= 0.019) precision = 8;
  else if (radiusInKm <= 0.076) precision = 7;
  else if (radiusInKm <= 0.6) precision = 6;
  else if (radiusInKm <= 2.4) precision = 5;
  else if (radiusInKm <= 19.5) precision = 4;
  else if (radiusInKm <= 78) precision = 3;
  else if (radiusInKm <= 310) precision = 2;

  const { latHeight, lngWidth } = getCellDimensions(precision);

  const lat = Number(latitude);
  const lng = Number(longitude);

  const coordinates = [
    { lat, lng },
    { lat: lat + latHeight, lng },
    { lat: lat - latHeight, lng },
    { lat, lng: lng + lngWidth },
    { lat, lng: lng - lngWidth },
    { lat: lat + latHeight, lng: lng + lngWidth },
    { lat: lat + latHeight, lng: lng - lngWidth },
    { lat: lat - latHeight, lng: lng + lngWidth },
    { lat: lat - latHeight, lng: lng - lngWidth }
  ];

  const prefixes = [...new Set(coordinates.map(c => encodeGeohash(c.lat, c.lng, precision)))];

  return prefixes.map(pref => ({
    start: pref,
    end: pref + '\uf8ff'
  }));
}

/**
 * Calculates the Haversine distance in kilometers between two points.
 */
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = {
  encodeGeohash,
  getGeohashQueryRanges,
  getHaversineDistance
};
