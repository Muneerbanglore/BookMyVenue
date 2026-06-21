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

module.exports = {
  encodeGeohash
};
