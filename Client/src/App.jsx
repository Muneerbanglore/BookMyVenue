import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './components/Header';
import Hero from './components/Hero';
import CuratedExperiences from './components/CuratedExperiences';
import OurPromise from './components/OurPromise';
import OwnCelebration from './components/OwnCelebration';
import Footer from './components/Footer';

// Import Modals
import ProfileModal from './components/Modals/ProfileModal';
import ListVenueModal from './components/Modals/ListVenueModal';
import BookingsModal from './components/Modals/BookingsModal';
import FavoritesModal from './components/Modals/FavoritesModal';
import BookVenueModal from './components/Modals/BookVenueModal';

export default function App() {
  const dispatch = useDispatch();

  // Local state for toggling modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isListVenueOpen, setIsListVenueOpen] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isBookVenueOpen, setIsBookVenueOpen] = useState(false);

  // State to pass which venue the user clicked "Book Now" on
  const [selectedVenue, setSelectedVenue] = useState(null);

  // Navigation active tab
  const [activeSection, setActiveSection] = useState('discover');

  // Notifications for temporary alert banner (micro-interactions)
  const notifications = useSelector((state) => state.venue.notifications);
  const latestNotification = notifications[0];

  const handleBookClick = (venue) => {
    setSelectedVenue(venue);
    setIsBookVenueOpen(true);
  };

  const handleListVenueClick = () => {
    setIsListVenueOpen(true);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Toast Alert Notification Banner */}
      {latestNotification && !latestNotification.read && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: latestNotification.type === 'success' ? '#0f172a' : '#1e1b4b',
            color: '#ffffff',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderLeft: `5px solid ${latestNotification.type === 'success' ? 'var(--accent-teal)' : 'var(--accent-gold)'}`,
            animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
            {latestNotification.message}
          </span>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        onListVenueClick={handleListVenueClick}
        onBookingsClick={() => setIsBookingsOpen(true)}
        onFavoritesClick={() => setIsFavoritesOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Sections */}
      <main style={{ flex: '1 0 auto' }}>
        <Hero />
        <CuratedExperiences onBookClick={handleBookClick} />
        <OurPromise />
        <OwnCelebration onListVenueClick={handleListVenueClick} />
      </main>

      {/* Footer */}
      <Footer
        onListVenueClick={handleListVenueClick}
        onBookingsClick={() => setIsBookingsOpen(true)}
        onFavoritesClick={() => setIsFavoritesOpen(true)}
      />

      {/* Modals & Overlays */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <ListVenueModal
        isOpen={isListVenueOpen}
        onClose={() => setIsListVenueOpen(false)}
      />

      <BookingsModal
        isOpen={isBookingsOpen}
        onClose={() => setIsBookingsOpen(false)}
      />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        onBookClick={handleBookClick}
      />

      <BookVenueModal
        isOpen={isBookVenueOpen}
        onClose={() => setIsBookVenueOpen(false)}
        venue={selectedVenue}
      />

    </div>
  );
}
