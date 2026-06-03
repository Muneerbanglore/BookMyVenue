import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBooking } from '../../store/venueSlice';
import { X, Calendar, DollarSign, Tag, Users } from 'lucide-react';

export default function BookVenueModal({ isOpen, onClose, venue }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.venue.currentUser);
  
  const [date, setDate] = useState('');
  const [eventType, setEventType] = useState('Wedding');
  const [error, setError] = useState('');

  if (!isOpen || !venue) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!date) {
      setError('Please select a booking date.');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to book a venue.');
      return;
    }

    dispatch(addBooking({
      venueId: venue.id,
      venueName: venue.name,
      date,
      eventType
    }));

    // Reset and close
    setDate('');
    setEventType('Wedding');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-scale-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Book Space</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
            <img 
              src={venue.image} 
              alt={venue.name} 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '8px',
                objectFit: 'cover'
              }}
            />
            <div>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-dark)', fontWeight: '600' }}>
                {venue.name}
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {venue.location} • {venue.capacity}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--accent-gold)', fontWeight: '700', fontSize: '0.9rem', marginTop: '4px' }}>
                <DollarSign size={14} style={{ marginRight: '-2px' }} />
                <span>{venue.price}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '400' }}> / day</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: '#fef2f2',
                color: '#ef4444',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '16px',
                border: '1px solid #fee2e2'
              }}>
                {error}
              </div>
            )}

            {!currentUser && (
              <div style={{
                background: '#fffbeb',
                color: '#b45309',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '16px',
                border: '1px solid #fef3c7'
              }}>
                Please sign in to complete your reservation. You can use the profile icon in the navigation bar.
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Select Date *</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="date" 
                  className="form-input" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  disabled={!currentUser}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Event Category</label>
              <div style={{ position: 'relative' }}>
                <Tag size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <select 
                  className="form-input" 
                  value={eventType} 
                  onChange={(e) => setEventType(e.target.value)}
                  style={{ paddingLeft: '42px', appearance: 'none', background: 'white' }}
                  disabled={!currentUser}
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Social">Social</option>
                  <option value="Exhibition">Exhibition</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="form-submit-btn" 
              style={{ background: 'var(--accent-teal)' }}
              disabled={!currentUser}
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
