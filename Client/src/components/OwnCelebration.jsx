import React from 'react';
import { Store, CalendarRange } from 'lucide-react';

export default function OwnCelebration({ onListVenueClick }) {
  return (
    <section style={{
      background: 'var(--bg-dark-section)',
      color: '#ffffff',
      padding: '80px 0 60px',
      textAlign: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div className="container">
        
        {/* CTA Content */}
        <div style={{ maxWidth: '720px', margin: '0 auto 60px' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '16px'
          }}>
            Own a Piece of the Celebration?
          </h2>
          <p style={{
            color: '#cbd5e1',
            fontSize: '1.05rem',
            lineHeight: '1.6',
            marginBottom: '32px'
          }}>
            Join an exclusive network of high-end venues. Increase your occupancy by 40% and manage your bookings with our professional management suite.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={onListVenueClick}
              style={{
                background: 'var(--accent-gold)',
                color: 'var(--primary-dark)',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'var(--transition-fast)'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--accent-gold-hover)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--accent-gold)'}
            >
              <Store size={18} />
              List Your Venue
            </button>
            
            <button 
              onClick={() => alert('Demo scheduler coming soon! For inquiry, please contact support.')}
              style={{
                background: 'rgba(255,255,255,0.03)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'var(--transition-fast)'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <CalendarRange size={18} />
              Schedule a Demo
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: 'rgba(255, 255, 255, 0.08)', marginBottom: '50px' }}></div>

        {/* Statistics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '30px',
          maxWidth: '960px',
          margin: '0 auto'
        }}>
          {[
            { metric: '500+', label: 'Elite Venues' },
            { metric: '12k', label: 'Success Events' },
            { metric: '4.9/5', label: 'User Rating' },
            { metric: '$2M+', label: 'Owner Earnings' }
          ].map((stat, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'var(--accent-gold)'
              }}>
                {stat.metric}
              </span>
              <span style={{
                fontSize: '0.875rem',
                color: '#94a3b8',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
