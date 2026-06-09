import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  className = '',
  style = {},
  ...props 
}) {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: '46px',
    padding: '0 24px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    cursor: isLoading || props.disabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    opacity: isLoading || props.disabled ? 0.7 : 1,
    border: 'none',
    ...style
  };

  const variants = {
    primary: {
      background: '#b0003a',
      color: '#ffffff',
      boxShadow: '0 4px 12px rgba(176,0,58,0.2)'
    },
    secondary: {
      background: '#f1f5f9',
      color: 'var(--text-dark)',
      border: '1px solid var(--border-light)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--primary-dark)',
      border: '2px solid var(--primary-dark)'
    },
    danger: {
      background: '#ef4444',
      color: '#ffffff'
    }
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <button 
      className={`btn-${variant} ${className}`} 
      style={{ ...baseStyle, ...currentVariant }}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
