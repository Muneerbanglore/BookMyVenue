import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/venueSlice';
import { MapPin, Pencil, Share2, Clock, CalendarPlus, Navigation, Bell, Heart, Shield, Star, LogOut } from 'lucide-react';
import s from './ProfilePage.styles';
import * as profileApi from '../api/profile.api';
import toast from 'react-hot-toast';
import MapViewer from '../components/common/MapViewer';
import ProfileCompleteDialog from '../components/common/ProfileCompleteDialog';

const DUMMY_BOOKINGS = [
  {
    id: 'VE-8829-XL',
    venue: 'The Glass Pavilion',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=200&q=80',
    date: 'Oct 24, 2024',
    time: '19:00',
    status: 'CONFIRMED',
    address: 'Vinery Estate, 122 Sunset Blvd, St. Helena, CA 94574',
    guests: 'Private Party (Up to 45 people)',
    perks: 'Complimentary Valet, Dedicated Host, Premium Cellar Access',
    hostNotes: '"The cellar tasting will begin promptly at 19:30. Please inform your guests regarding the semi-formal dress code."',
    daysToGo: 4,
    hoursToGo: 6
  },
  {
    id: 'VE-9012-MD',
    venue: 'Skyline Skybar',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=200&q=80',
    date: 'Nov 12, 2024',
    time: '21:00',
    status: 'CONFIRMED',
    address: 'Rooftop Level, 88 Broadway, New York, NY 10006',
    guests: 'Corporate Event (Up to 120 people)',
    perks: 'DJ Setup, Premium Bar Package, VIP Lounge Access',
    hostNotes: '"Please confirm final headcount 48 hours before the event. Elevator access will be provided."',
    daysToGo: 23,
    hoursToGo: 14
  },
  {
    id: 'VE-1150-SM',
    venue: 'Regal Estate',
    image: 'https://images.unsplash.com/photo-1585128792020-803d29415281?auto=format&fit=crop&w=200&q=80',
    date: 'Dec 05, 2024',
    time: '14:00',
    status: 'PENDING',
    address: 'Heritage Lane, Amber Fort Road, Jaipur, RJ 302001',
    guests: 'Wedding Reception (Up to 300 people)',
    perks: 'Floral Arrangements, Traditional Musicians, Royal Suite',
    hostNotes: '"Awaiting confirmation from the heritage committee. Expected approval within 3 business days."',
    daysToGo: 46,
    hoursToGo: 2
  }
];

const SAVED_VENUE_TYPES = ['Vineyards', 'Rooftops', 'Historical Estates', 'Art Galleries', 'Private Lounges'];

export default function ProfilePage({ onBack }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.venue.currentUser);
  const [selectedBookingIdx, setSelectedBookingIdx] = useState(0);
  const [notifSettings, setNotifSettings] = useState({
    bookingConfirmations: true,
    exclusiveOffers: true,
    smsAlerts: false
  });

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  // Determine if the logged-in user is a Venue Owner
  const isOwner = currentUser?.role === 'VENUE_OWNER' || currentUser?.role === 'Owner';

  // Show completion dialog when Owner logs in and hasn't completed their profile yet
  // profileData is null until it loads — if it stays null, profile is incomplete
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  // After profileData loads, show dialog if owner and profile looks incomplete
  useEffect(() => {
    if (isOwner && profileData !== null && !profileData?.businessName) {
      setShowCompleteDialog(true);
    }
  }, [isOwner, profileData]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!currentUser?.accessToken) return;
        const res = await profileApi.getUserProfile(currentUser.accessToken);
        console.log('Profile response:', res);
        const data = res.data?.user || res.user || res.data || {};
        setProfileData(data);
        setEditName(data.name || currentUser.name);
      } catch (err) {
        toast.error("Failed to load profile details.");
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleSaveProfile = async () => {
    try {
      const res = await profileApi.updateUserProfile(currentUser.accessToken, { name: editName });
      const data = res.data?.user || res.user || res.data || {};
      setProfileData(data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  const handleHeavyTask = async () => {
    try {
      toast.loading("Starting heavy task...", { id: 'heavyTask' });
      const res = await profileApi.triggerHeavyTask(currentUser.accessToken);
      toast.success(`Heavy task finished! Result: ${res.data}`, { id: 'heavyTask' });
    } catch (err) {
      toast.error("Heavy task failed.", { id: 'heavyTask' });
    }
  };

  const selectedBooking = DUMMY_BOOKINGS[selectedBookingIdx];

  const handleLogout = () => {
    dispatch(logoutUser());
    onBack();
  };

  return (
    <div style={s.pageContainer}>

      {/* Profile Completion Dialog — shown to Venue Owners with incomplete profiles */}
      {showCompleteDialog && (
        <ProfileCompleteDialog
          onClose={() => setShowCompleteDialog(false)}
          onComplete={async (formData) => {
            try {
              // Call the update profile API with the collected data
              await profileApi.updateUserProfile(currentUser.accessToken, {
                name: formData.businessName,
                location: formData.placeDetails ? {
                  coordinates: {
                    latitude: formData.placeDetails.lat,
                    longitude: formData.placeDetails.lng,
                  },
                  metadata: {
                    city: formData.location,
                  }
                } : undefined
              });
              setShowCompleteDialog(false);
              toast.success('Profile completed successfully!');
            } catch (err) {
              toast.error('Failed to save profile. Please try again.');
            }
          }}
        />
      )}

      {/* ─── Profile Header ─── */}
      <div style={s.headerSection}>
        <div style={s.headerCard}>
          {/* Left: Avatar + Info */}
          <div style={s.avatarInfoRow}>
            <div style={s.avatarWrapper}>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                alt="Profile"
                style={s.avatarImage}
              />
              <span style={s.onlineDot} />
            </div>
            <div>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '1rem', fontFamily: 'var(--font-heading)' }}
                  />
                  <button onClick={handleSaveProfile} style={{ background: '#b0003a', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                  <button onClick={() => setIsEditing(false)} style={{ background: '#f1f5f9', color: '#1a1a2e', border: 'none', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer' }}>Cancel</button>
                </div>
              ) : (
                <h2 style={s.userName}>
                  {profileData?.name || currentUser?.name || 'Alex Sterling'}
                </h2>
              )}
              <div style={s.badgeRow}>
                <span style={s.eliteBadge}>
                  <Star size={12} style={{ fill: '#ffffff' }} /> Elite Member
                </span>
                <span style={s.locationText}>
                  <MapPin size={14} /> {currentUser?.location || 'London, United Kingdom'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div style={s.actionButtonsRow}>
            <button style={s.editProfileBtn} onClick={() => setIsEditing(true)}>
              <Pencil size={15} /> Edit Profile
            </button>
            <button style={s.shareBtn}>
              <Share2 size={15} /> Share
            </button>
            <button onClick={handleLogout} style={s.logoutBtn}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* ─── Bookings Section ─── */}
      <div style={s.bookingsSection}>
        {/* Section Header */}
        <div style={s.bookingsSectionHeader}>
          <h3 style={s.bookingsTitle}>Upcoming Bookings</h3>
          <button style={s.viewAllBtn}>View All</button>
        </div>

        <div style={s.bookingsLayout}>

          {/* Left: Booking Cards List */}
          <div style={s.bookingsListCol}>
            {DUMMY_BOOKINGS.map((booking, idx) => (
              <div
                key={booking.id}
                onClick={() => setSelectedBookingIdx(idx)}
                style={s.bookingCard(selectedBookingIdx === idx)}
              >
                <img src={booking.image} alt={booking.venue} style={s.bookingThumb} />
                <div style={s.bookingCardContent}>
                  <div style={s.bookingCardHeader}>
                    <span style={s.bookingVenueName}>{booking.venue}</span>
                    <span style={s.statusBadge(booking.status)}>{booking.status}</span>
                  </div>
                  <div style={s.bookingDateTime}>
                    {booking.date} • {booking.time}
                  </div>
                  <div style={s.bookingIdText(booking.status)}>
                    {booking.status === 'PENDING' ? (
                      <><Clock size={11} /> Awaiting Approval</>
                    ) : (
                      <><span style={{ color: '#b0003a' }}>▣</span> #{booking.id}</>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Booking Detail Panel */}
          <div style={s.detailCol}>
            {/* Countdown Banner */}
            <div style={s.countdownBanner}>
              <div>
                <div style={s.countdownLabel}>TIME TO GO</div>
                <div style={s.countdownValue}>
                  {String(selectedBooking.daysToGo).padStart(2, '0')} Days : {String(selectedBooking.hoursToGo).padStart(2, '0')} Hours
                </div>
              </div>
              <button style={s.addToCalendarBtn}>
                <CalendarPlus size={14} /> Add to Calendar
              </button>
            </div>

            {/* Detail Card Body */}
            <div style={s.detailBody}>
              {/* Venue Name + Map */}
              <div style={s.venueMapRow}>
                <h3 style={s.detailVenueName}>{selectedBooking.venue}</h3>
                {/* Real Google Map — centers on booking coordinates if available */}
                <div style={s.mapContainer}>
                  <MapViewer
                    coordinates={
                      selectedBooking.lat && selectedBooking.lng
                        ? { lat: selectedBooking.lat, lng: selectedBooking.lng }
                        : null
                    }
                    zoom={14}
                  />
                  <button style={s.getDirectionsBtn}>
                    <Navigation size={12} /> Get Directions
                  </button>
                </div>
              </div>

              {/* Details List */}
              <div style={s.detailsList}>
                <div style={s.detailRow}>
                  <MapPin size={16} style={s.detailIcon} />
                  <div>
                    <div style={s.detailLabel}>Address</div>
                    <div style={s.detailValue}>{selectedBooking.address}</div>
                  </div>
                </div>
                <div style={s.detailRow}>
                  <span style={{ fontSize: '16px', marginTop: '2px', flexShrink: 0 }}>👥</span>
                  <div>
                    <div style={s.detailLabel}>Guests</div>
                    <div style={s.detailValue}>{selectedBooking.guests}</div>
                  </div>
                </div>
                <div style={s.detailRow}>
                  <Star size={16} style={s.detailIcon} />
                  <div>
                    <div style={s.detailLabel}>Elite Perks</div>
                    <div style={s.detailValue}>{selectedBooking.perks}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={s.actionBtnsRow}>
                <button style={s.modifyBtn}>Modify Booking</button>
                <button style={s.cancelBtn}>Cancel</button>
              </div>

              {/* Host Notes */}
              <div style={s.hostNotesBox}>
                <div style={s.hostNotesHeader}>
                  <div style={s.infoCircle}>i</div>
                  <span style={s.hostNotesLabel}>Host Notes</span>
                </div>
                <p style={s.hostNotesText}>{selectedBooking.hostNotes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Personal Preferences Section ─── */}
      <div style={s.preferencesSection}>
        <h3 style={s.preferencesTitle}>Personal Preferences</h3>

        <div style={s.preferencesGrid}>
          {/* Notification Settings */}
          <div style={s.prefCard}>
            <div style={s.prefHeader}>
              <Bell size={18} style={{ color: '#1a1a2e' }} />
              <span style={s.prefLabel}>Notification Settings</span>
            </div>

            {[
              { key: 'bookingConfirmations', label: 'Booking Confirmations' },
              { key: 'exclusiveOffers', label: 'Exclusive Elite Offers' },
              { key: 'smsAlerts', label: 'Sms Alerts' }
            ].map((item) => (
              <div key={item.key} style={s.toggleRow}>
                <span style={s.toggleItemLabel}>{item.label}</span>
                <button
                  onClick={() => setNotifSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  style={s.toggleTrack(notifSettings[item.key])}
                >
                  <span style={s.toggleThumb(notifSettings[item.key])} />
                </button>
              </div>
            ))}
          </div>

          {/* Saved Venue Types + Security */}
          <div style={s.prefCardFlex}>
            <div>
              <div style={s.prefHeaderSmall}>
                <Heart size={18} style={{ color: '#b0003a' }} />
                <span style={s.prefLabel}>Saved Venue Types</span>
              </div>

              <div style={s.tagsWrap}>
                {SAVED_VENUE_TYPES.map((type) => (
                  <span key={type} style={s.venueTag(type === 'Historical Estates')}>
                    {type}
                  </span>
                ))}
                <span style={s.addMoreTag}>+ Add More</span>
              </div>
            </div>

            {/* Account Security */}
            <div style={s.securityRow}>
              <div style={s.securityLabel}>
                <Shield size={14} style={{ color: '#64748b' }} />
                <span style={s.securityLabelText}>Account Security</span>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button style={s.manage2faBtn} onClick={handleHeavyTask}>Test Worker Task</button>
                <button style={s.manage2faBtn}>Manage 2FA</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
