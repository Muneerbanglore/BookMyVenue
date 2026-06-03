import React from 'react';
import { useSelector } from 'react-redux';
import { X, Calendar, MapPin, Tag } from 'lucide-react';

export default function BookingsModal({ isOpen, onClose }) {
  const bookings = useSelector((state) => state.venue.bookings);
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-scale-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3 className="modal-title">My Bookings</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
              <Calendar size={48} style={{ margin: '0 auto 12px', strokeWidth: '1.5px', color: 'var(--border-focus)' }} />
              <p>You don't have any bookings yet.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Find a premium space and request a date!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  style={{
                    background: 'var(--bg-slate)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '16px',
                    position: 'relative',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', fontWeight: '600', maxWidth: '75%' }}>
                      {booking.venueName}
                    </h4>
                    <span 
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '4px 8px',
                        borderRadius: '50px',
                        background: booking.status === 'Confirmed' ? '#dcfce7' : '#fef9c3',
                        color: booking.status === 'Confirmed' ? '#166534' : '#854d0e',
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      <span><strong>Event Date:</strong> {booking.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Tag size={14} />
                      <span><strong>Type:</strong> {booking.eventType}</span>
                    </div>
                  </div>

                  <div 
                    style={{ 
                      marginTop: '12px', 
                      paddingTop: '8px', 
                      borderTop: '1px dashed var(--border-light)', 
                      fontSize: '0.75rem', 
                      color: 'var(--text-muted)',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>ID: {booking.id}</span>
                    <span>Booked on: {booking.createdAt}</span>
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
