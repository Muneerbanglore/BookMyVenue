import React, { useState, useRef, useCallback } from 'react';
import { MapPin, X, Loader } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { getPlaceSuggestions, getPlaceDetails } from '../../api/maps.api';
import { setSelectedPlace, setSelectedCoordinates } from '../../store/venueSlice';

/**
 * LocationSearch — Reusable Google Places Autocomplete component.
 *
 * Props:
 *   onPlaceSelected(data) — optional callback fired when user selects a place.
 *                           data = { prediction, details, coords: { lat, lng } }
 *   placeholder           — input placeholder text
 *   inputStyle            — extra style overrides for the input wrapper div
 *
 * How it works:
 *   1. User types → debounce 300ms → call getPlaceSuggestions() on backend
 *   2. Backend proxies to Google Places Autocomplete → returns predictions[]
 *   3. Dropdown shows main_text (bold) + secondary_text (subtitle) per prediction
 *   4. User clicks a suggestion → call getPlaceDetails(place_id)
 *   5. Backend proxies to Google Place Details → returns geometry.location (lat/lng)
 *   6. lat/lng + selectedPlace saved to Redux
 *   7. onPlaceSelected callback fired with all the data
 */
export default function LocationSearch({
  onPlaceSelected,
  placeholder = 'Search location...',
  inputStyle = {}
}) {
  const dispatch = useDispatch();

  // What the user has typed in the input box
  const [inputValue, setInputValue] = useState('');

  // The list of autocomplete suggestions returned from the API
  const [suggestions, setSuggestions] = useState([]);

  // Whether the dropdown is currently visible
  const [isOpen, setIsOpen] = useState(false);

  // True while waiting for API response
  const [loading, setLoading] = useState(false);

  // Holds the setTimeout reference so we can cancel it on each keystroke (debounce)
  const debounceRef = useRef(null);

  // Fetch autocomplete suggestions after user stops typing for 300ms
  const fetchSuggestions = useCallback(async (text) => {
    // Don't search if less than 3 characters — avoids unnecessary API calls
    if (text.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getPlaceSuggestions(text);
      if (data.status === 'OK' && data.predictions) {
        setSuggestions(data.predictions);
        setIsOpen(true);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    } catch (err) {
      console.error('Autocomplete error:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Called on every keystroke
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    // Cancel the previous debounce timer and start a new one
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  // Called when user clicks a suggestion in the dropdown
  const handleSelect = async (prediction) => {
    // Fill the input with the full place description
    setInputValue(prediction.description);
    setSuggestions([]);
    setIsOpen(false);

    // Save the selected place info to Redux
    dispatch(setSelectedPlace({
      placeId: prediction.place_id,
      description: prediction.description,
      mainText: prediction.structured_formatting.main_text,
      secondaryText: prediction.structured_formatting.secondary_text,
    }));

    // Now fetch the full place details to get lat/lng
    try {
      const details = await getPlaceDetails(prediction.place_id);
      if (details.result?.geometry?.location) {
        const coords = {
          lat: details.result.geometry.location.lat,
          lng: details.result.geometry.location.lng,
        };

        // Save coordinates to Redux — available anywhere in the app
        dispatch(setSelectedCoordinates(coords));

        // Fire the parent's callback with everything it might need
        if (onPlaceSelected) {
          onPlaceSelected({
            prediction,
            details: details.result,
            coords,
          });
        }
      }
    } catch (err) {
      console.error('Place details error:', err);
    }
  };

  // Clear the input and reset state
  const handleClear = () => {
    setInputValue('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>

      {/* ── Input Wrapper ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '10px 14px',
        background: '#fff',
        transition: 'border-color 0.2s',
        ...inputStyle
      }}>
        <MapPin size={16} style={{ color: '#b0003a', flexShrink: 0 }} />

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          // Re-open dropdown if user focuses and suggestions exist
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          // Small delay before closing so clicks on suggestions register first
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.9rem',
            color: '#1a1a2e',
            background: 'transparent',
            fontFamily: 'var(--font-body)',
            fontWeight: '500'
          }}
        />

        {/* Spinner shown while API call is in flight */}
        {loading && (
          <Loader
            size={14}
            style={{ color: '#94a3b8', flexShrink: 0, animation: 'spin 1s linear infinite' }}
          />
        )}

        {/* Clear button shown when there's text and not loading */}
        {inputValue && !loading && (
          <button
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Suggestions Dropdown ── */}
      {isOpen && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          background: '#ffffff',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          border: '1px solid #f0f0f0',
          zIndex: 9999,
          overflow: 'hidden',
          maxHeight: '280px',
          overflowY: 'auto'
        }}>
          {suggestions.map((prediction) => (
            <div
              key={prediction.place_id}
              // onMouseDown fires before onBlur, so the click registers correctly
              onMouseDown={() => handleSelect(prediction)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid #f8f8f8',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#fdf2f5')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
            >
              {/* Main text — bold city/area name */}
              <div style={{
                fontWeight: '600',
                fontSize: '0.88rem',
                color: '#1a1a2e',
                marginBottom: '2px'
              }}>
                {prediction.structured_formatting.main_text}
              </div>

              {/* Secondary text — state, country */}
              <div style={{
                fontSize: '0.78rem',
                color: '#64748b'
              }}>
                {prediction.structured_formatting.secondary_text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
