import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../../store/venueSlice';
import { signInWithGoogle } from '../../firebase/firebaseConfig';
import { X, LogOut, Sparkles } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.venue.currentUser);

  const [isRegister, setIsRegister] = useState(false);
  const [userRole, setUserRole] = useState('Guest'); // Guest or Owner
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');


  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isRegister && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isRegister) {
      dispatch(loginUser({ name, email, role: userRole === 'Owner' ? 'Owner' : 'Client' }));
    } else {
      const defaultName = email.split('@')[0];
      const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
      dispatch(loginUser({ name: formattedName, email, role: userRole === 'Owner' ? 'Owner' : 'Client' }));
    }

    // Clear inputs and close
    setName('');
    setEmail('');
    setPassword('');
    onClose();
  };

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

            {/* Right Pane (Sign In / Register Fields) */}
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

              <div>
                {/* Header */}
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.65rem',
                  fontWeight: '800',
                  color: 'var(--primary-dark)',
                  marginBottom: '4px'
                }}>
                  {isRegister ? 'Sign Up' : 'Welcome Back'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
                  {isRegister ? 'Create your account to start booking' : 'Please enter your details to access your account.'}
                </p>

                {/* Role Switch Capsule */}
                <div style={{
                  background: '#f1f5f9',
                  borderRadius: '50px',
                  padding: '4px',
                  display: 'flex',
                  marginBottom: '20px'
                }}>
                  <button
                    type="button"
                    onClick={() => setUserRole('Guest')}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      borderRadius: '50px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      background: userRole === 'Guest' ? '#ffffff' : 'transparent',
                      color: userRole === 'Guest' ? '#b0003a' : 'var(--text-muted)',
                      boxShadow: userRole === 'Guest' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    I am a Guest
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRole('Owner')}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      borderRadius: '50px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      background: userRole === 'Owner' ? '#ffffff' : 'transparent',
                      color: userRole === 'Owner' ? '#b0003a' : 'var(--text-muted)',
                      boxShadow: userRole === 'Owner' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    I am a Venue Owner
                  </button>
                </div>

                {/* Continue with Google button */}
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const { user, idToken } = await signInWithGoogle();
                      console.log('Google sign‑in response:', { user, idToken });
                      dispatch(
                        loginUser({
                          name: user.displayName || 'Google User',
                          email: user.email,
                          role: userRole === 'Owner' ? 'Owner' : 'Client',
                          avatar: user.photoURL,
                        })
                      );
                      onClose();
                    } catch (err) {
                      console.error('Google sign‑in error:', err);
                      setError('Google sign‑in failed');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '50px',
                    border: '1px solid var(--border-light)',
                    background: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '20px',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-slate)'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#ffffff'}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                    alt="Google Logo"
                    style={{ width: '16px', height: '16px' }}
                  />
                  Continue with Google
                </button>

                {/* Divider Line */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '24px 0 16px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>OR EMAIL</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
                </div>

                {/* Input Fields */}
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

                  {isRegister && (
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.8rem' }}>Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ height: '42px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                        required
                      />
                    </div>
                  )}

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.8rem' }}>Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ height: '42px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.8rem', margin: 0 }}>Password</label>
                      {!isRegister && (
                        <button
                          type="button"
                          onClick={() => alert('Password reset link sent to your email!')}
                          style={{ color: '#b0003a', fontSize: '0.75rem', fontWeight: '600' }}
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ height: '42px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                      required
                    />
                  </div>

                  {/* Remember Me box */}
                  {!isRegister && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: '#b0003a', cursor: 'pointer' }}
                      />
                      <label htmlFor="rememberMe" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>
                        Remember me for 30 days
                      </label>
                    </div>
                  )}

                  {/* Crimson Login Button */}
                  <button
                    type="submit"
                    className="form-submit-btn"
                    style={{
                      background: '#b0003a',
                      color: '#ffffff',
                      height: '46px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      boxShadow: '0 4px 12px rgba(176,0,58,0.2)',
                      transition: 'var(--transition-fast)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#800028'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#b0003a'}
                  >
                    {isRegister ? 'Sign Up' : 'Login to VenueElite'}
                  </button>
                </form>
              </div>

              {/* Bottom Switch */}
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                </span>
                <button
                  type="button"
                  onClick={() => { setIsRegister(!isRegister); setError(''); }}
                  style={{ color: '#b0003a', fontWeight: '700', fontSize: '0.85rem' }}
                >
                  {isRegister ? 'Log in' : 'Sign up for free'}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
