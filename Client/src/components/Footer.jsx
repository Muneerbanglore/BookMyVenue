import React from 'react';
import { Globe, Mail, Sparkles } from 'lucide-react';

export default function Footer({ onListVenueClick, onBookingsClick, onFavoritesClick }) {
  return (
    <footer style={{
      background: '#ffffff',
      color: 'var(--text-dark)',
      padding: '80px 0 30px',
      borderTop: '1px solid var(--border-light)'
    }}>
      <div className="container">
        
        {/* Main Footer Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* Brand Info Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-dark) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
                border: '1.5px solid var(--accent-gold)'
              }}>
                <Sparkles size={16} style={{ fill: 'var(--accent-gold)' }} />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: '800',
                color: 'var(--primary-dark)',
                letterSpacing: '-0.5px'
              }}>
                Venue<span style={{ color: 'var(--primary-purple)' }}>Elite</span>
              </span>
            </div>
            
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              maxWidth: '260px'
            }}>
              Redefining the art of discovery for the world's most exceptional spaces.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href="https://wecode.org" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--bg-slate)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'var(--transition-fast)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-dark)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-slate)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                aria-label="Website"
              >
                <Globe size={16} />
              </a>
              <a 
                href="mailto:support@venueelite.com"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--bg-slate)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'var(--transition-fast)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-dark)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-slate)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Links Column 1: Explore */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary-dark)', marginBottom: '20px', textTransform: 'capitalize' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><a href="#discover" style={{ transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-dark)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Destinations</a></li>
              <li><a href="#discover" style={{ transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-dark)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Event Types</a></li>
              <li><a href="#curated-experiences" style={{ transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-dark)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Premium Collections</a></li>
              <li><a href="#all-venues" style={{ transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-dark)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Concierge Services</a></li>
            </ul>
          </div>

          {/* Links Column 2: Owners */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary-dark)', marginBottom: '20px', textTransform: 'capitalize' }}>
              For Owners
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><button onClick={onListVenueClick} style={{ color: 'inherit', transition: 'var(--transition-fast)', padding: 0 }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-dark)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>List a Venue</button></li>
              <li><button onClick={onListVenueClick} style={{ color: 'inherit', transition: 'var(--transition-fast)', padding: 0 }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-dark)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Management Dashboard</button></li>
              <li><a href="#pricing" style={{ transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-dark)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Pricing Plans</a></li>
              <li><a href="#docs" style={{ transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-dark)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Owner Resources</a></li>
            </ul>
          </div>

          {/* Links Column 3: Company */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary-dark)', marginBottom: '20px', textTransform: 'capitalize' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><a href="#about" style={{ transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-dark)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>About Us</a></li>
              <li><a href="#privacy" style={{ transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-dark)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Privacy Policy</a></li>
              <li><a href="#terms" style={{ transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-dark)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Terms of Service</a></li>
              <li><a href="#contact" style={{ transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-dark)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Contact Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '24px',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          © 2024 VenueElite Platform. All Rights Reserved. Designed for Excellence.
        </div>

      </div>
    </footer>
  );
}
