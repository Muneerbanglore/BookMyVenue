import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/venueSlice';
import { signInWithGoogle } from '../../firebase/firebaseConfig';
import { loginPrevalidation, loginValidation } from '../../api/auth.api';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import OtpModal from '../../components/common/OtpModal';

export default function LoginForm({ onClose, userRole, setUserRole, onSwitch }) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // OTP Modal State
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      const preData = await loginPrevalidation(email, password);
      console.log('Prevalidation Response:', preData);
      setIsOtpOpen(true);
      toast.success('OTP sent to your email.');
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    try {
      const valData = await loginValidation(email, otp);
      console.log('Validation Response:', valData);
      
      const defaultName = email.split('@')[0];
      const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
      
      const userData = valData.data?.user || valData.user || {};
      
      dispatch(loginUser({ 
        id: userData.id,
        name: userData.name || valData.name || formattedName, 
        email: userData.email || valData.email || email, 
        role: userData.role || valData.role || (userRole === 'Owner' ? 'Owner' : 'Client'),
        accessToken: valData.data?.accessToken,
        refreshToken: valData.data?.refreshToken
      }));

      toast.success('Logged in successfully!');
      setIsOtpOpen(false);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Invalid OTP.');
    }
  };

  const handleGoogleLogin = async () => {
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
      toast.success('Logged in with Google!');
      onClose();
    } catch (err) {
      console.error('Google sign‑in error:', err);
      toast.error('Google sign‑in failed');
    }
  };

  return (
    <div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '4px' }}>
        Welcome Back
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
        Please enter your details to access your account.
      </p>

      {/* Role Switch Capsule */}
      <div style={{ background: '#f1f5f9', borderRadius: '50px', padding: '4px', display: 'flex', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setUserRole('Guest')}
          style={{ flex: 1, padding: '8px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', background: userRole === 'Guest' ? '#ffffff' : 'transparent', color: userRole === 'Guest' ? '#b0003a' : 'var(--text-muted)', boxShadow: userRole === 'Guest' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', border: 'none', cursor: 'pointer' }}
        >
          I am a Guest
        </button>
        <button
          type="button"
          onClick={() => setUserRole('Owner')}
          style={{ flex: 1, padding: '8px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', background: userRole === 'Owner' ? '#ffffff' : 'transparent', color: userRole === 'Owner' ? '#b0003a' : 'var(--text-muted)', boxShadow: userRole === 'Owner' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', border: 'none', cursor: 'pointer' }}
        >
          I am a Venue Owner
        </button>
      </div>

      <Button variant="secondary" fullWidth onClick={handleGoogleLogin} style={{ marginBottom: '20px' }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '16px', height: '16px' }} />
        Continue with Google
      </Button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '24px 0 16px' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px' }}>OR EMAIL</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
      </div>

      <form onSubmit={handleLoginSubmit}>
        <Input
          id="login-email"
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          id="login-password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          rightElement={
            <button type="button" onClick={() => toast.success('Password reset link sent!')} style={{ color: '#b0003a', fontSize: '0.75rem', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
              Forgot Password?
            </button>
          }
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ accentColor: '#b0003a' }} />
          <label htmlFor="rememberMe" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>Remember me for 30 days</label>
        </div>

        <Button type="submit" fullWidth isLoading={loading}>
          Login to VenueElite
        </Button>
      </form>
      
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Don't have an account? </span>
        <button type="button" onClick={onSwitch} style={{ color: '#b0003a', fontWeight: '700', fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer' }}>
          Sign up for free
        </button>
      </div>

      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSubmit={handleOtpSubmit}
        email={email}
      />
    </div>
  );
}
