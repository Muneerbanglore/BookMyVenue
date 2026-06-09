import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/venueSlice';
import { signInWithGoogle } from '../../firebase/firebaseConfig';

export default function LoginForm({ onClose, userRole, setUserRole, onSwitch }) {
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_API_URL || 'https://bookmyvenue-2c0a.onrender.com/api/v1';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      // Step 1: Prevalidation
      const preRes = await fetch(`${BASE_URL}/auth/prevalidation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      let preData;
      try { preData = await preRes.json(); } catch (_) { preData = {}; }
      console.log('Prevalidation response:', preData);

      if (!preRes.ok) {
        setError(preData.message || 'Login failed. Please check your credentials.');
        return;
      }

      // Step 2: Prompt for OTP
      const enteredOtp = window.prompt('Please enter the OTP sent to your email:');
      if (!enteredOtp) {
        setError('OTP is required to login.');
        return;
      }

      // Step 3: Validation
      const valRes = await fetch(`${BASE_URL}/auth/validation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp })
      });
      
      let valData;
      try { valData = await valRes.json(); } catch (_) { valData = {}; }
      console.log('Validation response:', valData);

      if (!valRes.ok) {
        setError(valData.message || 'Invalid OTP.');
        return;
      }

      // Step 4: Login success
      const defaultName = email.split('@')[0];
      const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
      dispatch(loginUser({ 
        name: valData.user?.name || valData.name || formattedName, 
        email: valData.user?.email || valData.email || email, 
        role: valData.user?.role || valData.role || (userRole === 'Owner' ? 'Owner' : 'Client')
      }));

      onClose();
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    }
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
        Welcome Back
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
        Please enter your details to access your account.
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

      <form onSubmit={handleLogin}>
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

        <div className="form-group" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.8rem' }}>Email Address</label>
          <input
            type="email"
            className="form-input"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ height: '42px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem', paddingLeft: '16px', width: '100%' }}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.8rem', margin: 0 }}>Password</label>
            <button
              type="button"
              onClick={() => alert('Password reset link sent to your email!')}
              style={{ color: '#b0003a', fontSize: '0.75rem', fontWeight: '600' }}
            >
              Forgot Password?
            </button>
          </div>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ height: '42px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem', paddingLeft: '16px', width: '100%' }}
            required
          />
        </div>

        {/* Remember Me box */}
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
          Login to VenueElite
        </button>
      </form>
      
      {/* Bottom Switch */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
        </span>
        <button type="button"
          onClick={onSwitch}
          style={{ color: '#b0003a', fontWeight: '700', fontSize: '0.85rem' }}>
          Sign up for free
        </button>
      </div>
    </div>
  );
}
