import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  error,
  leftElement,
  rightElement,
  fullWidth = true,
  className = '',
  containerStyle = {},
  ...props
}) {
  return (
    <div className={`form-group ${className}`} style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: fullWidth ? '100%' : 'auto', ...containerStyle }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '6px' }}>
          <label htmlFor={id} style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.85rem', margin: 0 }}>
            {label}
          </label>
          {rightElement && rightElement}
        </div>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        {leftElement && (
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
            {leftElement}
          </div>
        )}
        <input
          id={id}
          type={type}
          style={{
            height: '46px',
            borderRadius: '8px',
            border: error ? '1px solid #ef4444' : '1px solid var(--border-light)',
            fontSize: '0.95rem',
            paddingLeft: leftElement ? '40px' : '16px',
            paddingRight: '16px',
            width: '100%',
            outline: 'none',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => { if(!error) e.target.style.borderColor = 'var(--primary-dark)'; }}
          onBlur={(e) => { if(!error) e.target.style.borderColor = 'var(--border-light)'; }}
          {...props}
        />
      </div>
      {error && (
        <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>
          {error}
        </span>
      )}
    </div>
  );
}
