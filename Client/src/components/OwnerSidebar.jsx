import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/venueSlice';
import {
  LayoutDashboard, Building2, CalendarDays, Star, LogOut, BarChart3
} from 'lucide-react';

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'venues', label: 'My Venues', icon: Building2 },
  { key: 'bookings', label: 'Bookings', icon: CalendarDays },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'reviews', label: 'Reviews', icon: Star },
];

export default function OwnerSidebar({ activeNav, onNavChange, onProfileClick }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.venue.currentUser);

  const handleLogout = () => {
    localStorage.removeItem('ownerActiveNav');
    dispatch(logoutUser());
  };

  const avatarInitials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'VO';

  return (
    <aside style={{
      width: '240px',
      flexShrink: 0,
      background: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
          Book<span style={{ color: '#b0003a' }}>My</span>Venue
        </div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontWeight: '500' }}>Owner Dashboard</div>
      </div>

      {/* Nav Items */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onNavChange(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '11px 12px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '4px',
              fontWeight: '600',
              fontSize: '0.85rem',
              transition: 'all 0.15s',
              background: activeNav === key ? 'rgba(176,0,58,0.18)' : 'transparent',
              color: activeNav === key ? '#f87171' : 'rgba(255,255,255,0.55)',
              textAlign: 'left'
            }}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom: User + Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Profile Row */}
        <button
          onClick={onProfileClick}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            width: '100%', padding: '10px 12px', borderRadius: '10px',
            border: 'none', cursor: 'pointer', background: activeNav === 'profile' ? 'rgba(176,0,58,0.18)' : 'rgba(255,255,255,0.05)',
            marginBottom: '6px', textAlign: 'left',
            transition: 'all 0.15s',
          }}
        >
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #b0003a, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: '800', color: '#fff', flexShrink: 0
          }}>
            {avatarInitials}
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff', lineHeight: 1.2 }}>{currentUser?.name || 'Venue Owner'}</div>
            <div style={{ fontSize: '0.7rem', color: activeNav === 'profile' ? '#f87171' : 'rgba(255,255,255,0.4)' }}>View Profile</div>
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            width: '100%', padding: '10px 12px', borderRadius: '10px',
            border: 'none', cursor: 'pointer', background: 'transparent',
            color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', fontWeight: '600',
            transition: 'color 0.15s', textAlign: 'left'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
