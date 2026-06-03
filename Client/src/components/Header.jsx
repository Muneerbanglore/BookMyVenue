import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Bell, User, Sparkles } from 'lucide-react';
import NotificationDropdown from './Modals/NotificationDropdown';

export default function Header({ 
  onListVenueClick, 
  onBookingsClick, 
  onFavoritesClick, 
  onProfileClick,
  activeSection,
  setActiveSection
}) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifications = useSelector((state) => state.venue.notifications);
  const currentUser = useSelector((state) => state.venue.currentUser);
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      background: '#ffffff',
      borderBottom: '1px solid var(--border-light)',
      zIndex: 100,
      height: '80px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveSection('discover')}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-dark) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)',
            boxShadow: 'var(--shadow-sm)',
            border: '2px solid var(--accent-gold)'
          }}>
            <Sparkles size={20} style={{ fill: 'var(--accent-gold)' }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            fontWeight: '800',
            color: 'var(--primary-dark)',
            letterSpacing: '-0.5px'
          }}>
            Venue<span style={{ color: 'var(--primary-purple)' }}>Elite</span>
          </span>
        </div>

        {/* Navigation Menu Links */}
        <nav style={{ display: 'flex', gap: '32px' }}>
          {[
            { id: 'discover', label: 'Discover' },
            { id: 'bookings', label: 'Bookings', action: onBookingsClick },
            { id: 'favorites', label: 'Favorites', action: onFavoritesClick },
            { id: 'management', label: 'Management', action: onListVenueClick }
          ].map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={link.action || (() => setActiveSection(link.id))}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? 'var(--accent-teal)' : 'var(--text-muted)',
                  padding: '8px 0',
                  position: 'relative',
                  transition: 'var(--transition-fast)'
                }}
                onMouseOver={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-dark)'; }}
                onMouseOut={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                {link.label}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--accent-teal)',
                    borderRadius: '2px',
                    animation: 'fadeIn 0.2s ease-out'
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions panel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={onListVenueClick}
            style={{
              background: 'var(--accent-gold)',
              color: '#ffffff',
              padding: '10px 22px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.9rem',
              boxShadow: 'var(--shadow-sm)',
              transition: 'var(--transition-fast)'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--accent-gold-hover)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'var(--accent-gold)'}
          >
            List Venue
          </button>

          <div style={{ height: '24px', width: '1px', background: 'var(--border-light)' }}></div>

          {/* Bell Icon Notification */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              style={{
                color: 'var(--text-dark)',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-fast)'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-slate)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              aria-label="Toggle notifications"
            >
              <Bell size={20} />
            </button>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                background: '#ef4444',
                borderRadius: '50%',
                border: '2px solid #ffffff'
              }} />
            )}
            
            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* User Profile */}
          <button 
            onClick={onProfileClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '50%',
              transition: 'var(--transition-fast)',
              border: currentUser ? '2px solid var(--accent-gold)' : 'none'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            aria-label="Profile"
          >
            {currentUser ? (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--primary-dark)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                {currentUser.avatar}
              </div>
            ) : (
              <User size={22} style={{ color: 'var(--text-dark)' }} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
