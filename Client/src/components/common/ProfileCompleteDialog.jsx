import React, { useState } from 'react';
import { X, Building } from 'lucide-react';
import LocationSearch from './LocationSearch';
import Button from './Button';
import Input from './Input';

/**
 * ProfileCompleteDialog — A 2-step modal for Venue Owners to complete their profile.
 *
 * Props:
 *   onClose()          — called when user clicks X or dismisses
 *   onComplete(data)   — called when user submits, receives:
 *                        { businessName, phone, location, placeDetails }
 *
 * Step 1: Business name + phone number
 * Step 2: Location search using Google Places autocomplete
 */
export default function ProfileCompleteDialog({ onClose, onComplete }) {
  const [step, setStep] = useState(1); // 1 or 2

  const [form, setForm] = useState({
    businessName: '',
    phone: '',
    location: '',       // full description string e.g. "Kollam, Kerala, India"
    placeDetails: null  // { formatted_address, lat, lng, photos }
  });

  // Called by LocationSearch when user selects a place
  const handleLocationSelected = ({ prediction, details }) => {
    setForm(f => ({
      ...f,
      location: prediction.description,
      placeDetails: {
        formatted_address: details.formatted_address,
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng,
        photos: details.photos || [],
      }
    }));
  };

  return (
    // Full-screen dark overlay
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Dialog Box */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '480px',
        position: 'relative',
        boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
        animation: 'fadeIn 0.3s ease'
      }}>

        {/* ─── Close Button (top-right corner) ─── */}
        <button
          onClick={onClose}
          title="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b'
          }}
        >
          <X size={15} />
        </button>

        {/* ─── Header ─── */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: '#fff5f7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Building size={24} style={{ color: '#b0003a' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: '800',
            color: '#1a1a2e',
            margin: '0 0 8px'
          }}>
            Complete Your Profile
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            {step === 1
              ? 'Tell us about your venue business to get started.'
              : 'Add your venue location so guests can find you.'}
          </p>
        </div>

        {/* ─── Progress Bar (2 segments) ─── */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {[1, 2].map(n => (
            <div
              key={n}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '4px',
                background: step >= n ? '#b0003a' : '#f1f5f9',
                transition: 'background 0.3s'
              }}
            />
          ))}
        </div>

        {/* ─── STEP 1: Business Info ─── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              id="profile-business-name"
              label="Business / Venue Name"
              placeholder="e.g. The Glass Pavilion"
              value={form.businessName}
              onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
            />
            <Input
              id="profile-phone"
              label="Phone Number"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
            <Button
              fullWidth
              onClick={() => setStep(2)}
              disabled={!form.businessName.trim() || !form.phone.trim()}
            >
              Continue →
            </Button>
          </div>
        )}

        {/* ─── STEP 2: Location Search ─── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                fontSize: '0.82rem',
                fontWeight: '600',
                color: '#1a1a2e',
                marginBottom: '6px',
                display: 'block'
              }}>
                Venue Location
              </label>
              {/* Uses your LocationSearch component — debounced Google Places autocomplete */}
              <LocationSearch
                placeholder="Search your venue city or address"
                onPlaceSelected={handleLocationSelected}
              />
            </div>

            {/* Confirmation once a place is selected */}
            {form.location && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '0.82rem',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>✓</span>
                <span>{form.location}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="secondary" fullWidth onClick={() => setStep(1)}>
                ← Back
              </Button>
              <Button
                fullWidth
                onClick={() => onComplete(form)}
                disabled={!form.location}
              >
                Save Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
