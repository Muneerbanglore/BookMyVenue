import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAllNotificationsAsRead } from '../../store/venueSlice';
import { Bell, Check, Info, AlertTriangle } from 'lucide-react';

export default function NotificationDropdown({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.venue.notifications);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Mark as read after opening
      dispatch(markAllNotificationsAsRead());
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, dispatch]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: '64px',
        right: '48px',
        width: '320px',
        maxHeight: '400px',
        overflowY: 'auto',
        background: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--border-radius-md)',
        boxShadow: 'var(--shadow-xl)',
        zIndex: 999,
        animation: 'slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-light)',
          background: 'var(--bg-slate)'
        }}
      >
        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary-dark)' }}>
          Notifications
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {notifications.filter(n => !n.read).length} unread
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Bell size={28} style={{ margin: '0 auto 8px', color: 'var(--border-focus)' }} />
            No notifications yet.
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              style={{
                display: 'flex',
                gap: '10px',
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-light)',
                background: notif.read ? 'transparent' : 'rgba(79, 70, 229, 0.03)',
                transition: 'var(--transition-fast)',
                cursor: 'pointer'
              }}
            >
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                  background: notif.type === 'success' ? '#dcfce7' : '#e0f2fe',
                  color: notif.type === 'success' ? '#166534' : '#0369a1'
                }}
              >
                {notif.type === 'success' ? <Check size={14} /> : <Info size={14} />}
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <p 
                  style={{ 
                    fontSize: '0.825rem', 
                    color: 'var(--text-dark)', 
                    lineHeight: '1.4', 
                    fontWeight: notif.read ? '400' : '600',
                    wordBreak: 'break-word'
                  }}
                >
                  {notif.message}
                </p>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  {notif.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
