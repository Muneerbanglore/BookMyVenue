import React, { useEffect, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };

/**
 * MapViewer — renders a Google Map with an optional marker.
 *
 * Props:
 *   coordinates  — { lat: number, lng: number } or null
 *                  When provided, the map centers on this point and shows a marker.
 *   zoom         — map zoom level (default 14, street-level detail)
 *
 * How it works:
 *   1. useJsApiLoader loads the Google Maps JS SDK using your env key.
 *   2. While loading, a simple dark placeholder is shown.
 *   3. Once loaded, <GoogleMap> renders with the given center.
 *   4. When `coordinates` changes (user picks new location), useEffect
 *      calls mapRef.current.panTo() for a smooth animated pan.
 *   5. <Marker> is only rendered when coordinates exist.
 */
export default function MapViewer({ coordinates, zoom = 14, onMapClick }) {
  // Holds a reference to the Google Map instance after it mounts
  const mapRef = useRef(null);

  // Loads the Google Maps JavaScript API — only loads once
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  // Whenever coordinates change, smoothly pan the map to the new location
  useEffect(() => {
    if (mapRef.current && coordinates) {
      mapRef.current.panTo(coordinates);
    }
  }, [coordinates]);

  // Show a loading placeholder while the Maps SDK initialises
  if (!isLoaded) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2b55 50%, #1a1a2e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.8rem',
        fontWeight: '600',
        letterSpacing: '0.5px'
      }}>
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      // Use the selected coordinates if available, otherwise show default India center
      center={coordinates || DEFAULT_CENTER}
      zoom={coordinates ? zoom : 5}
      // Store the map instance in mapRef so we can call panTo() later
      onLoad={(map) => { mapRef.current = map; }}
      onClick={(e) => {
        if (onMapClick) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          onMapClick({ lat, lng });
        }
      }}
      options={{
        disableDefaultUI: true,  // Hides all default controls (cleaner look)
        zoomControl: true,       // Keep only zoom buttons
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#0b0f19' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0b0f19' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#94a3b8' }],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#475569' }],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#111827' }],
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#475569' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#1f2937' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#111827' }],
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#64748b' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#1e3a8a' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#2563eb' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#cbd5e1' }],
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#1f2937' }],
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#64748b' }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#030712' }],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#3b82f6' }],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#030712' }],
          },
        ]
      }}
    >
      {/* Only render the marker pin when we have actual coordinates */}
      {coordinates && (
        <Marker
          position={coordinates}
          // Red marker to match the app's brand colour
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          }}
        />
      )}
    </GoogleMap>
  );
}
