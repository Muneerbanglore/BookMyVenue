import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/venueSlice';
import { signInWithGoogle, auth, sendSignInLinkToEmail } from '../../firebase/firebaseConfig';

export default function RegisterForm({ onClose, userRole, setUserRole, onSwitch }) {
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_API_URL || 'https://bookmyvenue-2c0a.onrender.com/api/v1';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [loadingVerification, setLoadingVerification] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !name) {
      setError('Please fill in all required fields.');
      return;
    }

    // Ensure email and phone have been verified before registering
    if (!emailVerified) {
      setError('Please verify your email before signing up');
      return;
    }
    if (!phoneVerified) {
      setError('Please verify your phone number before signing up');
      return;
    }

    // Add actual backend registration API call here if needed
    dispatch(loginUser({ name, email, role: userRole === 'Owner' ? 'Owner' : 'Client', avatar: '', phone }));
    onClose();
  };

  return (
    <div>
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.65rem',
        fontWeight: '800',
        color: 'var(--primary-dark)',
        marginBottom: '4px'
      }}>
        Sign Up
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
        Create your account to start booking
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
            const { user } = await signInWithGoogle();
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

      <form onSubmit={handleRegister}>
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

        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.8rem' }}>Full Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ height: '42px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem', paddingLeft: '16px' }}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.8rem' }}>Phone Number</label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="tel"
              className="form-input"
              placeholder="+1 555 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ height: '42px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem', paddingLeft: '90px', width: '100%' }}
            />
            {phone && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const sendPayload = { type: 'phone', target: phone };
                    const sendRes = await fetch(`${BASE_URL}/onboarding/otp/send`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(sendPayload)
                    });
                    if (!sendRes.ok) {
                      let msg = 'Phone verification failed';
                      try {
                        const err = await sendRes.json();
                        msg = err.message || msg;
                      } catch (_) { }
                      alert(msg);
                      return;
                    }
                    const otp = window.prompt('Enter the OTP sent to your phone');
                    if (!otp) return;

                    const verifyRes = await fetch(`${BASE_URL}/onboarding/otp/verify`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ type: 'phone', target: phone, code: otp })
                    });
                    if (verifyRes.ok) {
                      setPhoneVerified(true);
                      alert('Phone verification successful!');
                    } else {
                      let msg = 'OTP verification failed';
                      try {
                        const err = await verifyRes.json();
                        msg = err.message || msg;
                      } catch (_) { }
                      alert(msg);
                    }
                  } catch (e) {
                    alert('Network error while verifying phone');
                  }
                }}
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: phoneVerified ? '#34d399' : '#b0003a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {phoneVerified ? 'Verified' : 'Verify'}
              </button>
            )}
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.8rem' }}>Email Address</label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="email"
              className="form-input"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ height: '42px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem', paddingLeft: '90px', width: '100%' }}
              required
            />
            {email && (
              <button
                type="button"
                disabled={loadingVerification || emailVerified}
                onClick={async () => {
                  try {
                    setLoadingVerification(true);
                    const actionCodeSettings = {
                      url: window.location.href,
                      handleCodeInApp: true,
                    };
                    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
                    window.localStorage.setItem('emailForSignIn', email);
                    alert('Verification link sent! Please check your email to verify.');
                    setEmailVerified(true);
                  } catch (e) {
                    alert('Error sending verification link: ' + e.message);
                  } finally {
                    setLoadingVerification(false);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: emailVerified ? '#34d399' : (loadingVerification ? '#9ca3af' : '#b0003a'),
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  cursor: (loadingVerification || emailVerified) ? 'not-allowed' : 'pointer'
                }}
              >
                {loadingVerification ? 'Sending...' : (emailVerified ? 'Verified' : 'Verify')}
              </button>
            )}
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.8rem', margin: 0 }}>Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ height: '42px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem', paddingLeft: '16px', width: '100%', marginTop: '6px' }}
            required
          />
        </div>

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
            transition: 'var(--transition-fast)',
            marginTop: '16px'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#800028'}
          onMouseOut={(e) => e.currentTarget.style.background = '#b0003a'}
        >
          Sign Up
        </button>
      </form>

      {/* Bottom Switch */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
        </span>
        <button type="button"
          onClick={onSwitch}
          style={{ color: '#b0003a', fontWeight: '700', fontSize: '0.85rem' }}>
          Log in
        </button>
      </div>
    </div>
  );
}
