const BASE_URL = import.meta.env.VITE_API_URL || 'https://bookmyvenue-2c0a.onrender.com/api/v1';

/**
 * Fetch autocomplete place suggestions from your backend proxy.
 * Backend calls: GET https://maps.googleapis.com/maps/api/place/autocomplete/json
 *
 * @param {string} input - The text the user typed (e.g. "kollam kerala")
 * @returns {Promise<{ predictions: Array, status: string }>}
 *
 * Each prediction has:
 *   - place_id               → unique Google place identifier
 *   - description            → full location text (e.g. "Kollam, Kerala, India")
 *   - structured_formatting  → { main_text, secondary_text } — used to display in dropdown
 */
export const getPlaceSuggestions = async (input) => {
  const res = await fetch(
    `${BASE_URL}/maps/places/autocomplete?input=${encodeURIComponent(input)}`
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Autocomplete request failed');
  return data;
};

/**
 * Fetch full details for a specific place using its place_id.
 * Backend calls: GET https://maps.googleapis.com/maps/api/place/details/json
 *
 * @param {string} placeId - The place_id from an autocomplete suggestion
 * @returns {Promise<{ result: Object, status: string }>}
 *
 * result contains:
 *   - result.name                     → "Kollam"
 *   - result.formatted_address        → "Kollam, Mayyanad, Kerala 691303, India"
 *   - result.geometry.location.lat    → 8.839
 *   - result.geometry.location.lng    → 76.646
 *   - result.photos[]                 → array of photo references (if available)
 */
export const getPlaceDetails = async (placeId) => {
  const res = await fetch(
    `${BASE_URL}/maps/places/details?placeId=${encodeURIComponent(placeId)}`
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Place details request failed');
  return data;
};
