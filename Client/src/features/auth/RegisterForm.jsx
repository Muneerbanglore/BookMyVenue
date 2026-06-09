import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/venueSlice';
import { signInWithGoogle, auth, sendSignInLinkToEmail } from '../../firebase/firebaseConfig';
import { sendPhoneOtp, verifyPhoneOtp } from '../../api/auth.api';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import OtpModal from '../../components/common/OtpModal';

export default function RegisterForm({ onClose, userRole, setUserRole, onSwitch }) {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  
  const [loadingVerification, setLoadingVerification] = useState(false);
  
  // OTP Modal State for Phone Verification
  const [isPhoneOtpOpen, setIsPhoneOtpOpen] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!emailVerified) {
      toast.error('Please verify your email before signing up');
      return;
    }
    if (!phoneVerified) {
      toast.error('Please verify your phone number before signing up');
      return;
    }

    // Add actual backend registration API call here if needed
    dispatch(loginUser({ name, email, role: userRole === 'Owner' ? 'Owner' : 'Client', avatar: '', phone }));
    toast.success('Registration successful!');
    onClose();
  };

  const handleSendPhoneOtp = async () => {
    if (!phone) {
      toast.error('Please enter a phone number first.');
      return;
    }
    try {
      await sendPhoneOtp(phone);
      setPhoneToVerify(phone);
      setIsPhoneOtpOpen(true);
      toast.success('OTP sent to your phone.');
    } catch (err) {
      toast.error(err.message || 'Phone verification failed');
    }
  };

  const handleVerifyPhoneOtp = async (otp) => {
    try {
      await verifyPhoneOtp(phoneToVerify, otp);
      setPhoneVerified(true);
      setIsPhoneOtpOpen(false);
      toast.success('Phone verified successfully!');
    } catch (err) {
      toast.error(err.message || 'Invalid OTP.');
    }
  };

  const handleSendEmailLink = async () => {
    if (!email) {
      toast.error('Please enter an email address first.');
      return;
    }
    try {
      setLoadingVerification(true);
      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      toast.success('Verification link sent! Please check your email.');
      setEmailVerified(true); // Simulating verification for demo
    } catch (e) {
      console.error(e);
      toast.error('Error sending verification link: ' + e.message);
    } finally {
      setLoadingVerification(false);
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
      toast.success('Signed in with Google!');
      onClose();
    } catch (err) {
      console.error('Google sign‑in error:', err);
      toast.error('Google sign‑in failed');
    }
  };

  return (
    <div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '4px' }}>
        Sign Up
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
        Create your account to start booking
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

      <form onSubmit={handleRegisterSubmit}>
        <Input
          id="reg-name"
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          id="reg-phone"
          label="Phone Number"
          type="tel"
          placeholder="+1 555 123 4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          rightElement={
            phone && (
              <Button 
                type="button" 
                variant="primary" 
                style={{ height: '30px', padding: '0 12px', fontSize: '0.75rem', background: phoneVerified ? '#34d399' : '#b0003a' }}
                onClick={handleSendPhoneOtp}
                disabled={phoneVerified}
              >
                {phoneVerified ? 'Verified' : 'Verify'}
              </Button>
            )
          }
        />

        <Input
          id="reg-email"
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          rightElement={
            email && (
              <Button 
                type="button" 
                variant="primary" 
                style={{ height: '30px', padding: '0 12px', fontSize: '0.75rem', background: emailVerified ? '#34d399' : '#b0003a' }}
                onClick={handleSendEmailLink}
                isLoading={loadingVerification}
                disabled={emailVerified}
              >
                {emailVerified ? 'Verified' : 'Verify'}
              </Button>
            )
          }
        />

        <Input
          id="reg-password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" fullWidth style={{ marginTop: '16px' }}>
          Sign Up
        </Button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Already have an account? </span>
        <button type="button" onClick={onSwitch} style={{ color: '#b0003a', fontWeight: '700', fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer' }}>
          Log in
        </button>
      </div>

      <OtpModal
        isOpen={isPhoneOtpOpen}
        onClose={() => setIsPhoneOtpOpen(false)}
        onSubmit={handleVerifyPhoneOtp}
        title="Verify Phone"
      />
    </div>
  );
}
