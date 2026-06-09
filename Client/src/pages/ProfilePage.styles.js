// All styles for ProfilePage.jsx extracted into a single export object

const profileStyles = {

  // ── Page Container ──
  pageContainer: {
    flex: '1 0 auto',
    background: '#f8f8f8',
    minHeight: '100vh'
  },

  // ── Profile Header Section ──
  headerSection: {
    maxWidth: '80%',
    margin: '0 auto',
    padding: '40px 24px 0'
  },
  headerCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '32px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    border: '1px solid #f0f0f0'
  },
  avatarInfoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  avatarWrapper: {
    position: 'relative'
  },
  avatarImage: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #1a1a2e'
  },
  onlineDot: {
    position: 'absolute',
    bottom: '4px',
    right: '4px',
    width: '14px',
    height: '14px',
    background: '#22c55e',
    borderRadius: '50%',
    border: '3px solid #ffffff'
  },
  userName: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#1a1a2e',
    margin: '0 0 8px'
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  eliteBadge: {
    background: '#b0003a',
    color: '#ffffff',
    padding: '4px 14px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  locationText: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#64748b',
    fontSize: '0.85rem'
  },
  actionButtonsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  editProfileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    color: '#1a1a2e',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  shareBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: '#b0003a',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #fecaca',
    background: '#fff5f5',
    color: '#ef4444',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },

  // ── Bookings Section ──
  bookingsSection: {
    maxWidth: '80%',
    margin: '0 auto',
    padding: '40px 24px'
  },
  bookingsSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  bookingsTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.35rem',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0
  },
  viewAllBtn: {
    color: '#b0003a',
    fontWeight: '600',
    fontSize: '0.85rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  bookingsLayout: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start'
  },
  bookingsListCol: {
    flex: '0 0 320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  bookingCard: (isSelected) => ({
    background: '#ffffff',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
    border: isSelected ? '2px solid #b0003a' : '1px solid #f0f0f0',
    boxShadow: isSelected ? '0 0 0 3px rgba(176,0,58,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'all 0.2s'
  }),
  bookingThumb: {
    width: '60px',
    height: '60px',
    borderRadius: '10px',
    objectFit: 'cover'
  },
  bookingCardContent: {
    flex: 1
  },
  bookingCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '4px'
  },
  bookingVenueName: {
    fontWeight: '700',
    fontSize: '0.9rem',
    color: '#1a1a2e'
  },
  statusBadge: (status) => ({
    fontSize: '0.6rem',
    fontWeight: '800',
    color: '#ffffff',
    background: status === 'CONFIRMED' ? '#b0003a' : '#94a3b8',
    padding: '3px 8px',
    borderRadius: '4px',
    letterSpacing: '0.5px'
  }),
  bookingDateTime: {
    fontSize: '0.78rem',
    color: '#64748b',
    marginBottom: '2px'
  },
  bookingIdText: (status) => ({
    fontSize: '0.72rem',
    color: status === 'PENDING' ? '#94a3b8' : '#b0003a',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  }),

  // ── Booking Detail Panel ──
  detailCol: {
    flex: 1
  },
  countdownBanner: {
    background: '#1a1a2e',
    borderRadius: '14px 14px 0 0',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  countdownLabel: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: '#b0003a',
    letterSpacing: '1.5px',
    marginBottom: '4px'
  },
  countdownValue: {
    color: '#ffffff',
    fontSize: '1.3rem',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)'
  },
  addToCalendarBtn: {
    background: '#ffffff',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '0.78rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  detailBody: {
    background: '#ffffff',
    borderRadius: '0 0 14px 14px',
    padding: '28px',
    border: '1px solid #f0f0f0',
    borderTop: 'none'
  },
  venueMapRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '24px'
  },
  detailVenueName: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#1a1a2e',
    margin: 0,
    lineHeight: '1.2'
  },
  mapContainer: {
    width: '200px',
    height: '120px',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    flexShrink: 0,
    background: '#1a1a2e'
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2b55 50%, #1a1a2e 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  mapGridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08
  },
  getDirectionsBtn: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'rgba(26,26,46,0.85)',
    backdropFilter: 'blur(4px)',
    color: '#ffffff',
    border: 'none',
    padding: '8px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px'
  },
  detailRow: {
    display: 'flex',
    gap: '10px'
  },
  detailIcon: {
    color: '#b0003a',
    marginTop: '2px',
    flexShrink: 0
  },
  detailLabel: {
    fontWeight: '700',
    fontSize: '0.85rem',
    color: '#1a1a2e',
    marginBottom: '2px'
  },
  detailValue: {
    fontSize: '0.82rem',
    color: '#64748b',
    lineHeight: '1.4'
  },
  actionBtnsRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  },
  modifyBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    color: '#1a1a2e',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #fecaca',
    background: '#ffffff',
    color: '#ef4444',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer'
  },

  // ── Host Notes ──
  hostNotesBox: {
    background: '#f8fafc',
    borderRadius: '10px',
    padding: '18px 20px',
    border: '1px solid #f0f0f0'
  },
  hostNotesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px'
  },
  infoCircle: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    border: '2px solid #94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    color: '#64748b',
    fontWeight: '700'
  },
  hostNotesLabel: {
    fontWeight: '700',
    fontSize: '0.85rem',
    color: '#1a1a2e'
  },
  hostNotesText: {
    color: '#64748b',
    fontSize: '0.82rem',
    lineHeight: '1.6',
    margin: 0,
    fontStyle: 'italic'
  },

  // ── Personal Preferences Section ──
  preferencesSection: {
    maxWidth: '80%',
    margin: '0 auto',
    padding: '0 24px 60px'
  },
  preferencesTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.35rem',
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: '28px'
  },
  preferencesGrid: {
    display: 'flex',
    gap: '20px'
  },
  prefCard: {
    flex: 1,
    background: '#ffffff',
    borderRadius: '14px',
    padding: '28px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
  },
  prefCardFlex: {
    flex: 1,
    background: '#ffffff',
    borderRadius: '14px',
    padding: '28px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  prefHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px'
  },
  prefHeaderSmall: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px'
  },
  prefLabel: {
    fontWeight: '700',
    fontSize: '0.95rem',
    color: '#1a1a2e'
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f8f8f8'
  },
  toggleItemLabel: {
    fontSize: '0.85rem',
    color: '#1a1a2e',
    fontWeight: '500'
  },
  toggleTrack: (isOn) => ({
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    border: 'none',
    background: isOn ? '#b0003a' : '#e2e8f0',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background 0.2s'
  }),
  toggleThumb: (isOn) => ({
    position: 'absolute',
    top: '3px',
    left: isOn ? '23px' : '3px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: '#ffffff',
    transition: 'left 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
  }),
  tagsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px'
  },
  venueTag: (isHighlighted) => ({
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: '600',
    border: isHighlighted ? '2px solid #b0003a' : '1px solid #e2e8f0',
    color: isHighlighted ? '#b0003a' : '#64748b',
    background: isHighlighted ? '#fff5f7' : '#ffffff',
    cursor: 'pointer'
  }),
  addMoreTag: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: '600',
    border: '1px dashed #cbd5e1',
    color: '#94a3b8',
    cursor: 'pointer'
  },
  securityRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #f0f0f0'
  },
  securityLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  securityLabelText: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '500'
  },
  manage2faBtn: {
    color: '#b0003a',
    fontWeight: '700',
    fontSize: '0.82rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },

  // ── Map Dot helper ──
  mapDot: (top, left, right, bottom, size, color) => ({
    position: 'absolute',
    top, left, right, bottom,
    width: size,
    height: size,
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 8px ${color}99`
  })
};

export default profileStyles;
