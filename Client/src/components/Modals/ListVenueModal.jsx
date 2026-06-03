import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addVenue } from '../../store/venueSlice';
import { X, Building, MapPin, Users, DollarSign, Image, AlignLeft } from 'lucide-react';

export default function ListVenueModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('Up to 100 guests');
  const [type, setType] = useState('Wedding');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !location || !price || !description) {
      setError('Please fill in all required fields.');
      return;
    }

    dispatch(addVenue({
      name,
      location,
      capacity,
      type,
      price: Number(price),
      description,
      image: imageUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80'
    }));

    // Reset inputs
    setName('');
    setLocation('');
    setCapacity('Up to 100 guests');
    setType('Wedding');
    setPrice('');
    setDescription('');
    setImageUrl('');
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">List Your Venue</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
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

            <div className="form-group">
              <label className="form-label">Venue Name *</label>
              <div style={{ position: 'relative' }}>
                <Building size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Grand Sapphire Ballroom" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location (City, Country) *</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Paris, France" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Capacity Range</label>
                <div style={{ position: 'relative' }}>
                  <Users size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <select 
                    className="form-input" 
                    value={capacity} 
                    onChange={(e) => setCapacity(e.target.value)}
                    style={{ paddingLeft: '42px', appearance: 'none', background: 'white' }}
                  >
                    <option value="Up to 50 guests">Up to 50 guests</option>
                    <option value="Up to 100 guests">Up to 100 guests</option>
                    <option value="Up to 250 guests">Up to 250 guests</option>
                    <option value="Up to 500 guests">Up to 500 guests</option>
                    <option value="Up to 1000 guests">Up to 1000 guests</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Event Type</label>
                <select 
                  className="form-input" 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Social">Social</option>
                  <option value="Exhibition">Exhibition</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price per Day ($) *</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="e.g. 2500" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <div style={{ position: 'relative' }}>
                  <Image size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://images.unsplash.com/..." 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <div style={{ position: 'relative' }}>
                <AlignLeft size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <textarea 
                  className="form-input" 
                  rows="3" 
                  placeholder="Describe your venue's unique amenities and architecture..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ paddingLeft: '42px', resize: 'vertical' }}
                  required
                ></textarea>
              </div>
            </div>

            <button type="submit" className="form-submit-btn">
              Publish Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
