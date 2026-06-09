import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from './store/venueSlice';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';
import { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';

// Import Modals from Features
import ProfileModal from './features/auth/ProfileModal';
// import ListVenueModal from './features/venues/ListVenueModal';
// import BookingsModal from './features/bookings/BookingsModal';
// import FavoritesModal from './features/bookings/FavoritesModal';
// import BookVenueModal from './features/venues/BookVenueModal';

export default function App() {
  const dispatch = useDispatch();

  // Handle Firebase Email Link Sign-In
  useEffect(() => {
    const handleEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        if (email) {
          try {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            const defaultName = email.split('@')[0];
            const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
            dispatch(loginUser({
              name: result.user.displayName || formattedName,
              email: result.user.email,
              role: 'Client',
              avatar: result.user.photoURL || ''
            }));
            window.history.replaceState(null, '', window.location.pathname);
            // Replaced alert with nothing since auth logic moved
          } catch (error) {
            console.error('Error signing in with email link:', error);
          }
        }
      }
    };
    handleEmailLink();
  }, [dispatch]);

  // Local state for toggling modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [isListVenueOpen, setIsListVenueOpen] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isBookVenueOpen, setIsBookVenueOpen] = useState(false);

  const currentUser = useSelector((state) => state.venue.currentUser);

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
      <Toaster position="top-right" />

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
        onProfileClick={() => {
          if (currentUser) {
            setShowProfilePage(true);
          } else {
            setIsProfileOpen(true);
          }
        }}
        activeSection={activeSection}
        setActiveSection={(section) => {
          setShowProfilePage(false);
          setActiveSection(section);
        }}
      />

      {/* Main Content */}
      {showProfilePage && currentUser ? (
        <ProfilePage onBack={() => setShowProfilePage(false)} />
      ) : (
        <Home
          handleBookClick={handleBookClick}
          handleListVenueClick={handleListVenueClick}
        />
      )}

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

      {/* <ListVenueModal
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
      /> */}

    </div>
  );
}
