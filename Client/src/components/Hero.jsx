import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchFilters, triggerSearch } from '../store/venueSlice';
import { Calendar, Sparkles, Search } from 'lucide-react';
import LocationSearch from './common/LocationSearch';

export default function Hero() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.venue.searchFilters);

  const handleLocationChange = (e) => {
    dispatch(setSearchFilters({ location: e.target.value }));
  };

  const handleDateChange = (e) => {
    dispatch(setSearchFilters({ date: e.target.value }));
  };

  const handleTypeChange = (e) => {
    dispatch(setSearchFilters({ eventType: e.target.value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(triggerSearch());
    const element = document.getElementById('curated-experiences');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Called when user selects a place from the LocationSearch dropdown
  // coords = { lat, lng } — already saved to Redux by LocationSearch internally
  const handlePlaceSelected = ({ coords }) => {
    dispatch(triggerSearch());
    const element = document.getElementById('curated-experiences');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      position: 'relative',
      height: '640px',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#ffffff',
      textAlign: 'center',
      padding: '0 20px'
    }}>
      {/* Hero Headline Texts */}
      <div style={{ maxWidth: '800px', marginBottom: '40px', animation: 'fadeIn 0.6s ease-out' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '3.5rem',
          fontWeight: '800',
          lineHeight: '1.2',
          letterSpacing: '-1px',
          color: '#ffffff',
          marginBottom: '16px'
        }}>
          Find the Perfect Space for Your<br />Next Extraordinary Event
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.15rem',
          fontWeight: '400',
          lineHeight: '1.6',
          color: 'rgba(255, 255, 255, 0.9)',
          maxWidth: '650px',
          margin: '0 auto'
        }}>
          From intimate galas to grand corporate summits, VenueElite connects you with the world's most prestigious and unique event destinations.
        </p>
      </div>

      {/* Capsule Search Bar Overlay */}
      <form
        onSubmit={handleSearch}
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: 'var(--border-radius-xl)',
          padding: '12px 16px 12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '90%',
          maxWidth: '900px',
          boxShadow: 'var(--shadow-xl)',
          animation: 'fadeIn 0.8s ease-out',
          color: 'var(--text-dark)',
          position: 'absolute',
          bottom: '-36px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        }}
      >
        {/* Column 1: Location — uses Google Places Autocomplete */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '4px' }}>Location</span>
            {/* LocationSearch replaces the plain input.
                - Debounces 300ms, calls /maps/places/autocomplete
                - On selection, fetches /maps/places/details for lat/lng
                - Saves selectedPlace + selectedCoordinates to Redux */}
            <LocationSearch
              placeholder="Where are you going"
              onPlaceSelected={handlePlaceSelected}
              inputStyle={{
                border: 'none',
                padding: '0',
                boxShadow: 'none',
                borderRadius: 0,
                background: 'transparent'
              }}
            />
          </div>
        </div>

        <div style={{ width: '1px', height: '40px', background: 'rgba(0,0,0,0.1)' }}></div>

        {/* Column 2: Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 0.8, minWidth: 0 }}>
          <Calendar size={22} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Date</span>
            <input
              type="date"
              value={filters.date}
              onChange={handleDateChange}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text-dark)',
                width: '100%',
                fontWeight: '500',
                marginTop: '2px',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>

        <div style={{ width: '1px', height: '40px', background: 'rgba(0,0,0,0.1)' }}></div>

        {/* Column 3: Event Type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 0.8, minWidth: 0 }}>
          <Sparkles size={22} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Event Type</span>
            <select
              value={filters.eventType}
              onChange={handleTypeChange}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text-dark)',
                width: '100%',
                fontWeight: '500',
                marginTop: '2px',
                cursor: 'pointer',
                appearance: 'none'
              }}
            >
              <option value="Wedding">Wedding</option>
              <option value="Corporate">Corporate</option>
              <option value="Social">Social</option>
              <option value="Exhibition">Exhibition</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          style={{
            background: 'var(--primary-dark)',
            color: '#ffffff',
            padding: '14px 28px',
            borderRadius: '16px',
            fontWeight: '600',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-md)',
            transition: 'var(--transition-fast)',
            flexShrink: 0
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Search size={18} />
          Search
        </button>
      </form>
    </section>
  );
}
