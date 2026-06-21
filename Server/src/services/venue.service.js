const db = require('../config/firebase');
const { getGeohashQueryRanges, getHaversineDistance } = require('../utils/geohash');

/**
 * Searches for venues within a given radius (in km) around center coordinates.
 * @param {number} latitude - Center latitude
 * @param {number} longitude - Center longitude
 * @param {number} radiusInKm - Search radius in kilometers
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} List of venues with calculated distance
 */
const searchNearbyVenues = async (latitude, longitude, radiusInKm = 10, limit = 20) => {
  if (!db) {
    throw new Error('Firestore database is not initialized.');
  }

  const lat = Number(latitude);
  const lng = Number(longitude);
  const radius = Number(radiusInKm);

  // Generate range bounds for the geohash queries
  const ranges = getGeohashQueryRanges(lat, lng, radius);

  // Execute all prefix range queries in parallel
  const queryPromises = ranges.map(range => {
    return db.collection('venue_owners')
      .orderBy('location.geohash')
      .startAt(range.start)
      .endAt(range.end)
      .get();
  });

  const snapshots = await Promise.all(queryPromises);

  // Deduplicate and filter results
  const candidatesMap = new Map();

  snapshots.forEach(snapshot => {
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      // Ensure the document has location and coordinates
      if (data.location && data.location.coordinates) {
        candidatesMap.set(doc.id, {
          id: doc.id,
          ...data
        });
      }
    });
  });

  // Calculate distance, filter, and sort
  const results = [];
  for (const [id, venue] of candidatesMap.entries()) {
    const { latitude: vLat, longitude: vLng } = venue.location.coordinates;
    const distance = getHaversineDistance(lat, lng, vLat, vLng);

    if (distance <= radius) {
      results.push({
        id: venue.id,
        venue_name: venue.venue_name,
        description: venue.description,
        established_year: venue.established_year,
        main_image: venue.main_image,
        location: venue.location,
        images: venue.images,
        venue_details: venue.venue_details,
        distance: Number(distance.toFixed(3)) // Round to 3 decimal places
      });
    }
  }

  // Sort by distance (closest first)
  results.sort((a, b) => a.distance - b.distance);

  // Apply limit
  return results.slice(0, Number(limit));
};

module.exports = {
  searchNearbyVenues
};
