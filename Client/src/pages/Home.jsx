import React from 'react';
import Hero from '../components/Hero';
import CuratedExperiences from '../features/venues/CuratedExperiences';
import OurPromise from '../components/OurPromise';
import OwnCelebration from '../features/venues/OwnCelebration';

export default function Home({ handleBookClick, handleListVenueClick }) {
  return (
    <main style={{ flex: '1 0 auto' }}>
      <Hero />
      <CuratedExperiences onBookClick={handleBookClick} />
      <OurPromise />
      <OwnCelebration onListVenueClick={handleListVenueClick} />
    </main>
  );
}
