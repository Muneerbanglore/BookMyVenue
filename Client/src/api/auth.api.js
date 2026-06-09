const BASE_URL = import.meta.env.VITE_API_URL || 'https://bookmyvenue-2c0a.onrender.com/api/v1';

export const loginPrevalidation = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/prevalidation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Login failed. Please check your credentials.');
  return data;
};

export const loginValidation = async (email, otp) => {
  const res = await fetch(`${BASE_URL}/auth/validation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Invalid OTP.');
  return data;
};

export const refreshSession = async (refreshToken) => {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Session refresh failed');
  return data;
};

export const sendPhoneOtp = async (phone) => {
  const res = await fetch(`${BASE_URL}/onboarding/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'phone', target: phone })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Phone verification failed');
  return data;
};

export const verifyPhoneOtp = async (phone, otp) => {
  const res = await fetch(`${BASE_URL}/onboarding/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'phone', target: phone, code: otp })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'OTP verification failed');
  return data;
};
