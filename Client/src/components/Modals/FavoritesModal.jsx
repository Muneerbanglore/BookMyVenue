import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../../store/venueSlice';
import { X, Heart, MapPin, ExternalLink, Calendar } from 'lucide-react';

export default function FavoritesModal({ isOpen, onClose, onBookClick }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.venue.favorites);
  const venues = useSelector((state) => state.venue.venues);

  // Get full venue details for favorited items
  const favoriteVenues = venues.filter((venue) => favorites.includes(venue.id));

  if (!isOpen) return null;

  const handleRemove = (id) => {
    dispatch(toggleFavorite(id));
  };

  const handleBook = (venue) => {
    onClose();
    if (onBookClick) {
      onBookClick(venue);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-scale-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3 className="modal-title">My Favorites</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          {favoriteVenues.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
              <Heart size={48} style={{ margin: '0 auto 12px', fill: 'none', strokeWidth: '1.5px', color: 'var(--border-focus)' }} />
              <p>Your favorites list is empty.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Tap the heart icon on any venue to save it here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {favoriteVenues.map((venue) => (
                <div 
                  key={venue.id} 
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '10px',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--border-light)',
                    background: '#ffffff',
                    position: 'relative'
                  }}
                >
                  <img 
                    src={venue.image} 
                    alt={venue.name} 
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, minWidth: 0 }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-dark)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {venue.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        <MapPin size={12} />
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{venue.location}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-dark)' }}>
                        ${venue.price}/day
                      </span>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleRemove(venue.id)}
                          style={{
                            padding: '4px',
                            color: '#ef4444',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Remove from favorites"
                        >
                          <Heart size={16} style={{ fill: '#ef4444', stroke: '#ef4444' }} />
                        </button>
                        
                        <button 
                          onClick={() => handleBook(venue)}
                          style={{
                            padding: '4px 8px',
                            background: 'var(--accent-teal)',
                            color: '#ffffff',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Calendar size={12} />
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
