import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import Input from './Input';

export default function OtpModal({ isOpen, onClose, onSubmit, email, title = "Enter OTP" }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    await onSubmit(otp);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1050 }} onClick={onClose}>
      <div 
        className="modal-content animate-scale-in" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '400px',
          width: '90%',
          borderRadius: '16px',
          padding: '32px',
          background: '#ffffff',
          position: 'relative'
        }}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '8px', textAlign: 'center' }}>
          {title}
        </h3>
        {email && (
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            We've sent a code to <br/><strong>{email}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            id="otp"
            label="Verification Code"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            autoFocus
          />
          <Button type="submit" fullWidth isLoading={loading} style={{ marginTop: '16px' }}>
            Verify
          </Button>
        </form>
      </div>
    </div>
  );
}
