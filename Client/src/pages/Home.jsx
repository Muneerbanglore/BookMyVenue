import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedCoordinates } from '../store/venueSlice';
import Hero from '../components/Hero';
import CuratedExperiences from '../features/venues/CuratedExperiences';
import OurPromise from '../components/OurPromise';
import OwnCelebration from '../features/venues/OwnCelebration';
import toast from 'react-hot-toast';

export default function Home({ handleBookClick, handleListVenueClick }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if browser supports geolocation
    if (!navigator.geolocation) return;

    // Ask the browser for permission and current position
    navigator.geolocation.getCurrentPosition(
      // SUCCESS — user allowed location access
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // Save to Redux — now selectedCoordinates is available everywhere
        dispatch(setSelectedCoordinates(coords));
        toast.success('Showing venues near your location!', { duration: 3000 });
      },
      // FAILURE — user denied or location unavailable
      () => {
        // Don't block the user — just nudge them to use manual search
        toast('Use the search bar to find venues near any city', {
          icon: '📍',
          duration: 4000,
        });
      }
    );
  }, [dispatch]); // Only runs once when Home mounts

  return (
    <main style={{ flex: '1 0 auto' }}>
      <Hero />
      <CuratedExperiences onBookClick={handleBookClick} />
      <OurPromise />
      <OwnCelebration onListVenueClick={handleListVenueClick} />
    </main>
  );
}
