import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowLeft, User, MapPin, Sparkles, Save, Phone, Mail, CheckCircle } from 'lucide-react';
import LocationSearch from '../../components/common/LocationSearch';
import MapViewer from '../../components/common/MapViewer';
import toast from 'react-hot-toast';

export default function OwnerProfilePage({ onBack }) {
  const currentUser = useSelector((state) => state.venue.currentUser);

  // ── Section 1: Basic Details ──
  const [basic, setBasic] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
  });

  // ── Section 2: Location ──
  const [locationText, setLocationText] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [locationSaved, setLocationSaved] = useState(false);

  // ── Section 3: Venue Details ──
  const [details, setDetails] = useState({
    description: '',
    capacity: '',
    venueType: '',
    highlights: '',
  });

  const handlePlaceSelected = ({ prediction, coords }) => {
    setLocationText(prediction.description);
    setCoordinates(coords);
    setLocationSaved(false);
  };

  const handleMapClick = (coords) => {
    setCoordinates(coords);
    setLocationSaved(false);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: coords }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setLocationText(results[0].formatted_address);
      } else {
        toast.error("Could not fetch location details")
      }
    })
  }

  const handleSaveLocation = () => {
    if (!coordinates) {
      toast.error('Please select a location from the dropdown first.');
      return;
    }
    try {
      setLocationSaved(true);
      toast.success('Location saved!');
      console.log('Saved coordinates:', coordinates);
    } catch (error) {
      toast.error('Failed to save location.');
    }
  };

  const handleSaveBasic = () => {
    toast.success('Basic details saved!');
    console.log('Saved basic:', basic);
  };

  const handleSaveDetails = () => {
    toast.success('Venue details saved!');
    console.log('Saved details:', details);
  };

  // ── Reusable styles ──
  const card = {
    background: '#fff',
    borderRadius: '16px',
    padding: '28px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    marginBottom: '20px',
  };

  const label = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#374151',
    marginBottom: '6px',
  };

  const input = {
    width: '100%',
    height: '44px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    padding: '0 14px',
    fontSize: '0.9rem',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const sectionTitle = {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#111827',
    margin: '0 0 4px',
    fontFamily: 'var(--font-heading)',
  };

  const sectionSubtitle = {
    fontSize: '0.78rem',
    color: '#6b7280',
    margin: '0 0 24px',
  };

  const saveBtn = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    background: '#111827',
    color: '#fff',
    border: 'none',
    borderRadius: '9px',
    padding: '10px 22px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
  };

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', fontFamily: 'var(--font-body)', flex: 1, overflowY: 'auto' }}>

      {/* ── Top Bar ── */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #f1f5f9',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#f3f4f6', border: 'none', borderRadius: '8px',
            padding: '8px 14px', cursor: 'pointer',
            fontSize: '0.82rem', fontWeight: '700', color: '#374151',
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: '#111827', fontFamily: 'var(--font-heading)' }}>
            Owner Profile
          </div>
          <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Complete your profile to list venues</div>
        </div>
      </div>

      {/* ── Sections ── */}
      <div style={{
        maxWidth: '1200px',
        margin: '28px auto',
        padding: '0 20px 60px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>

        {/* Left Column: Basic Details & Venue Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* ══ SECTION 1: Basic Details ══ */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{ background: '#ede9fe', borderRadius: '8px', padding: '7px', display: 'flex' }}>
                <User size={16} style={{ color: '#7c3aed' }} />
              </div>
              <div style={sectionTitle}>Basic Details</div>
            </div>
            <div style={sectionSubtitle}>Your name, email and phone number</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={label}>Full Name</label>
                <input
                  style={input}
                  placeholder="Your full name"
                  value={basic.name}
                  onChange={e => setBasic(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label style={label}>Email</label>
                <input
                  style={{ ...input, background: '#f9fafb', color: '#6b7280' }}
                  value={basic.email}
                  readOnly
                />
              </div>
              <div>
                <label style={label}>Phone Number</label>
                <input
                  style={input}
                  placeholder="+91 98765 43210"
                  value={basic.phone}
                  onChange={e => setBasic(p => ({ ...p, phone: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button style={saveBtn} onClick={handleSaveBasic}>
                <Save size={14} /> Save
              </button>
            </div>
          </div>

          {/* ══ SECTION 3: Venue Details ══ */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{ background: '#fef3c7', borderRadius: '8px', padding: '7px', display: 'flex' }}>
                <Sparkles size={16} style={{ color: '#d97706' }} />
              </div>
              <div style={sectionTitle}>Venue Details & Highlights</div>
            </div>
            <div style={sectionSubtitle}>Describe what makes your venue special</div>

            {/* Description */}
            <div style={{ marginBottom: '14px' }}>
              <label style={label}>Description</label>
              <textarea
                value={details.description}
                onChange={e => setDetails(p => ({ ...p, description: e.target.value }))}
                placeholder="Describe your venue — atmosphere, setting, uniqueness..."
                rows={4}
                style={{
                  width: '100%', borderRadius: '8px', border: '1px solid #e5e7eb',
                  padding: '10px 14px', fontSize: '0.88rem', resize: 'vertical',
                  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#111827',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={label}>Max Capacity</label>
                <input
                  style={input}
                  placeholder="e.g. 200 guests"
                  value={details.capacity}
                  onChange={e => setDetails(p => ({ ...p, capacity: e.target.value }))}
                />
              </div>
              <div>
                <label style={label}>Venue Type</label>
                <select
                  value={details.venueType}
                  onChange={e => setDetails(p => ({ ...p, venueType: e.target.value }))}
                  style={{ ...input, appearance: 'none', cursor: 'pointer', background: '#fff' }}
                >
                  <option value="">Select type...</option>
                  <option>Wedding Hall</option>
                  <option>Rooftop</option>
                  <option>Conference Room</option>
                  <option>Banquet Hall</option>
                  <option>Garden / Outdoor</option>
                  <option>Beach Venue</option>
                  <option>Heritage Estate</option>
                  <option>Private Villa</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={label}>Highlights</label>
              <input
                style={input}
                placeholder="e.g. Rooftop view, AC Hall, Parking, Catering available"
                value={details.highlights}
                onChange={e => setDetails(p => ({ ...p, highlights: e.target.value }))}
              />
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '5px' }}>Separate with commas</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{ ...saveBtn, background: '#d97706' }} onClick={handleSaveDetails}>
                <Save size={14} /> Save Details
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Venue Location (Map) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* ══ SECTION 2: Location ══ */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{ background: '#fef2f2', borderRadius: '8px', padding: '7px', display: 'flex' }}>
                <MapPin size={16} style={{ color: '#b0003a' }} />
              </div>
              <div style={sectionTitle}>Venue Location</div>
            </div>
            <div style={sectionSubtitle}>
              Search your venue address → select from dropdown → pin appears on map → click Save Location
            </div>

            {/* Location Search */}
            <div style={{ marginBottom: '14px' }}>
              <label style={label}>Search Address</label>
              <LocationSearch
                placeholder="Type your venue city or address..."
                onPlaceSelected={handlePlaceSelected}
              />
            </div>

            {/* Selected location confirmation */}
            {locationText && (
              <div style={{
                background: '#fef9c3', border: '1px solid #fde047',
                borderRadius: '8px', padding: '9px 14px',
                fontSize: '0.8rem', color: '#854d0e',
                marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '7px',
              }}>
                <MapPin size={13} /> {locationText}
              </div>
            )}

            {/* Google Map */}
            <div style={{ height: '360px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', marginBottom: '14px' }}>
              <MapViewer coordinates={coordinates} zoom={14} onMapClick={handleMapClick} />
            </div>

            {/* Coordinates */}
            {coordinates && (
              <div style={{
                background: '#f3f4f6', borderRadius: '8px', padding: '10px 14px',
                fontSize: '0.78rem', color: '#374151', marginBottom: '14px',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <span><strong>Lat:</strong> {coordinates.lat.toFixed(6)}</span>
                <span><strong>Lng:</strong> {coordinates.lng.toFixed(6)}</span>
                {locationSaved && (
                  <span style={{ marginLeft: 'auto', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                    <CheckCircle size={13} /> Saved
                  </span>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                style={{ ...saveBtn, background: coordinates ? '#b0003a' : '#d1d5db', cursor: coordinates ? 'pointer' : 'not-allowed' }}
                onClick={handleSaveLocation}
                disabled={!coordinates}
              >
                <MapPin size={14} /> Save Location
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
