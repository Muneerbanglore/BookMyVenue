import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/venueSlice';
import { X, LogOut, Sparkles } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function ProfileModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.venue.currentUser);

  const [isRegister, setIsRegister] = useState(false);
  const [userRole, setUserRole] = useState('Guest'); // Guest or Owner

  if (!isOpen) return null;

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: currentUser ? '400px' : '850px',
          width: '90%',
          borderRadius: '20px',
          overflow: 'hidden',
          border: 'none',
          background: '#ffffff'
        }}
      >
        {currentUser ? (
          /* Profile Details View (For Logged In Users) */
          <div>
            <div className="modal-header">
              <h3 className="modal-title">Your Profile</h3>
              <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '30px 24px' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #99002d 0%, #66001e 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: '700',
                margin: '0 auto 16px',
                boxShadow: 'var(--shadow-md)',
                border: '3px solid var(--accent-gold)'
              }}>
                {currentUser.avatar}
              </div>
              <h4 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '4px', fontWeight: '700' }}>{currentUser.name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>{currentUser.email}</p>

              <div style={{
                background: 'var(--bg-slate)',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '24px',
                fontSize: '0.85rem',
                color: 'var(--text-dark)',
                border: '1px solid var(--border-light)'
              }}>
                <strong>Account Type:</strong> {currentUser.role === 'Owner' ? 'Venue Partner (Owner)' : 'Guest'}
              </div>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#ef4444',
                  color: '#ffffff',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  transition: 'var(--transition-fast)'
                }}
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Crimson and White Split Authentication View */
          <div style={{ display: 'flex', minHeight: '520px', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>

            {/* Left Pane (Crimson Brand Panel) */}
            <div style={{
              flex: '1.1',
              background: 'linear-gradient(135deg, #b0003a 0%, #800028 100%)',
              color: '#ffffff',
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Top Close Button for Mobile layout */}
              <button
                className="modal-close-btn"
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  color: '#ffffff',
                  background: 'rgba(255,255,255,0.1)',
                  display: window.innerWidth < 768 ? 'flex' : 'none'
                }}
              >
                <X size={18} />
              </button>

              {/* Brand Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} style={{ color: '#ffffff', fill: '#ffffff' }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                  VenueElite
                </span>
              </div>

              {/* Main Headline */}
              <div style={{ margin: '40px 0' }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.2rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  lineHeight: '1.2',
                  marginBottom: '16px',
                  letterSpacing: '-0.5px'
                }}>
                  Secure your next extraordinary venue.
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  fontWeight: '300'
                }}>
                  Experience the world's most exclusive spaces with a booking process designed for perfection.
                </p>
              </div>

              {/* Trusted hosts strip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {/* overlapping avatar circles */}
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Host"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #b0003a', objectFit: 'cover' }}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="Host"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #b0003a', objectFit: 'cover', marginLeft: '-12px' }}
                  />
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#e11d48',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    border: '2px solid #b0003a',
                    marginLeft: '-12px'
                  }}>
                    +2k
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>
                  Trusted by 2,000+ top-tier hosts
                </span>
              </div>
            </div>

            {/* Right Pane (Sign In / Register Forms) */}
            <div style={{
              flex: '1.2',
              background: '#ffffff',
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              {/* Close Button */}
              <button
                className="modal-close-btn"
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  display: window.innerWidth < 768 ? 'none' : 'flex'
                }}
              >
                <X size={20} />
              </button>

              {isRegister ? (
                <RegisterForm 
                  onClose={onClose} 
                  userRole={userRole} 
                  setUserRole={setUserRole} 
                  onSwitch={() => setIsRegister(false)} 
                />
              ) : (
                <LoginForm 
                  onClose={onClose} 
                  userRole={userRole} 
                  setUserRole={setUserRole} 
                  onSwitch={() => setIsRegister(true)} 
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
