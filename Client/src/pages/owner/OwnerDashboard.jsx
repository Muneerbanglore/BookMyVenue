import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/venueSlice';
import {
  LayoutDashboard, Building2, CalendarDays, Star,
  TrendingUp, Users, DollarSign, Eye, Plus,
  Bell, Settings, LogOut, MapPin, ArrowUpRight,
  ChevronRight, BarChart3
} from 'lucide-react';

// ── Dummy data for the dashboard ──────────────────────────────
const STATS = [
  { label: 'Total Revenue', value: '₹2,40,000', change: '+18%', icon: DollarSign, color: '#10b981' },
  { label: 'Total Bookings', value: '34', change: '+7%', icon: CalendarDays, color: '#6366f1' },
  { label: 'Active Listings', value: '4', change: '+1', icon: Building2, color: '#f59e0b' },
  { label: 'Profile Views', value: '1,284', change: '+22%', icon: Eye, color: '#b0003a' },
];

const MY_VENUES = [
  {
    id: 1,
    name: 'The Glass Pavilion',
    location: 'Vinery Estate, St. Helena, CA',
    status: 'ACTIVE',
    bookings: 12,
    rating: 4.9,
    revenue: '₹86,400',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    name: 'Skyline Skybar',
    location: 'Rooftop Level, 88 Broadway, New York',
    status: 'ACTIVE',
    bookings: 9,
    rating: 4.7,
    revenue: '₹72,000',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    name: 'Regal Estate',
    location: 'Heritage Lane, Amber Fort Road, Jaipur',
    status: 'PENDING',
    bookings: 5,
    rating: 4.5,
    revenue: '₹45,000',
    image: 'https://images.unsplash.com/photo-1585128792020-803d29415281?auto=format&fit=crop&w=300&q=80',
  },
];

const RECENT_BOOKINGS = [
  { id: 'BK-001', guest: 'Arjun Sharma', venue: 'The Glass Pavilion', date: 'Jun 28, 2026', amount: '₹12,000', status: 'CONFIRMED' },
  { id: 'BK-002', guest: 'Priya Nair', venue: 'Skyline Skybar', date: 'Jul 02, 2026', amount: '₹18,500', status: 'CONFIRMED' },
  { id: 'BK-003', guest: 'Mohammed Al Farsi', venue: 'Regal Estate', date: 'Jul 14, 2026', amount: '₹32,000', status: 'PENDING' },
  { id: 'BK-004', guest: 'Sneha Kulkarni', venue: 'The Glass Pavilion', date: 'Jul 20, 2026', amount: '₹9,600', status: 'CONFIRMED' },
];

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'venues', label: 'My Venues', icon: Building2 },
  { key: 'bookings', label: 'Bookings', icon: CalendarDays },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'reviews', label: 'Reviews', icon: Star },
];

// ── Sub-components ───────────────────────────────────────────

function StatusBadge({ status }) {
  const colors = {
    ACTIVE: { bg: '#ecfdf5', text: '#166534', dot: '#22c55e' },
    CONFIRMED: { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
    PENDING: { bg: '#fffbeb', text: '#92400e', dot: '#f59e0b' },
  };
  const c = colors[status] || colors.PENDING;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: c.bg, color: c.text, borderRadius: '20px', padding: '3px 10px', fontSize: '0.72rem', fontWeight: '700' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot }} />
      {status}
    </span>
  );
}

// ── Main Dashboard Component ──────────────────────────────────

export default function OwnerDashboard({ activeNav, setActiveNav }) {
  const currentUser = useSelector((state) => state.venue.currentUser);

  return (
    <main style={{ flex: 1, overflowY: 'auto' }}>

        {/* Top Bar */}
        <div style={{
          padding: '20px 32px',
          background: '#fff',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: 0, fontFamily: 'var(--font-heading)' }}>
              Good morning, {currentUser?.name?.split(' ')[0] || 'Owner'} 👋
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: '500' }}>
              Here's what's happening with your venues today.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#b0003a', color: '#fff', border: 'none',
              borderRadius: '10px', padding: '9px 18px', cursor: 'pointer',
              fontSize: '0.83rem', fontWeight: '700', boxShadow: '0 4px 12px rgba(176,0,58,0.25)'
            }}>
              <Plus size={15} /> Add Venue
            </button>
            <button style={{
              width: '38px', height: '38px', borderRadius: '10px',
              border: '1px solid #e2e8f0', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b', position: 'relative'
            }}>
              <Bell size={17} />
              <span style={{
                position: 'absolute', top: '7px', right: '7px',
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#b0003a', border: '1.5px solid #fff'
              }} />
            </button>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* ── STATS GRID ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
            {STATS.map(({ label, value, change, icon: Icon, color }) => (
              <div key={label} style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '20px 24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} style={{ color }} />
                  </div>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{value}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                  <ArrowUpRight size={13} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981' }}>{change}</span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>this month</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── MY VENUES + RECENT BOOKINGS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>

            {/* My Venues */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0, fontFamily: 'var(--font-heading)' }}>My Venues</h2>
                <button style={{ fontSize: '0.78rem', color: '#b0003a', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View All <ChevronRight size={13} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {MY_VENUES.map(venue => (
                  <div key={venue.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: '#fafafa', border: '1px solid #f1f5f9' }}>
                    <img src={venue.image} alt={venue.name} style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{venue.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.73rem', color: '#94a3b8', marginTop: '2px' }}>
                        <MapPin size={11} />{venue.location.split(',').slice(-2).join(',').trim()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <StatusBadge status={venue.status} />
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>⭐ {venue.rating}</span>
                        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700' }}>{venue.revenue}</span>
                      </div>
                    </div>
                    <button style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#64748b' }}>
                      <Settings size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0, fontFamily: 'var(--font-heading)' }}>Recent Bookings</h2>
                <button style={{ fontSize: '0.78rem', color: '#b0003a', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View All <ChevronRight size={13} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {/* Header Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr', gap: '8px', padding: '8px 10px', marginBottom: '4px' }}>
                  {['Guest', 'Venue', 'Date', 'Status'].map(h => (
                    <span key={h} style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
                  ))}
                </div>
                {RECENT_BOOKINGS.map((b, i) => (
                  <div key={b.id} style={{
                    display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr', gap: '8px',
                    padding: '12px 10px', borderRadius: '10px',
                    background: i % 2 === 0 ? '#fafafa' : '#fff',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a' }}>{b.guest}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{b.id}</div>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.venue.split(' ').slice(0, 3).join(' ')}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.date.split(',')[0]}</div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', borderRadius: '20px', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', margin: '0 0 6px', fontFamily: 'var(--font-heading)' }}>
                Ready to expand your portfolio?
              </h2>
              <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                List a new venue and reach thousands of event planners today.
              </p>
            </div>
            <button style={{
              background: '#b0003a', color: '#fff', border: 'none',
              borderRadius: '12px', padding: '12px 24px', cursor: 'pointer',
              fontSize: '0.88rem', fontWeight: '700', flexShrink: 0,
              boxShadow: '0 4px 16px rgba(176,0,58,0.4)',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Plus size={16} /> Add New Venue
            </button>
          </div>

        </div>
      </main>
  );
}
