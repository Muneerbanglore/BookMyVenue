const fs = require('fs');
const path = require('path');

const clientSrc = path.join(__dirname, 'src');

const filesToMove = [
  // Layout
  { src: 'components/Header.jsx', dest: 'components/layout/Header.jsx' },
  { src: 'components/Footer.jsx', dest: 'components/layout/Footer.jsx' },
  { src: 'components/Hero.jsx', dest: 'components/layout/Hero.jsx' },
  { src: 'components/OurPromise.jsx', dest: 'components/layout/OurPromise.jsx' },
  // Venues
  { src: 'components/CuratedExperiences.jsx', dest: 'features/venues/CuratedExperiences.jsx' },
  { src: 'components/OwnCelebration.jsx', dest: 'features/venues/OwnCelebration.jsx' },
  { src: 'components/Modals/ListVenueModal.jsx', dest: 'features/venues/ListVenueModal.jsx' },
  { src: 'components/Modals/BookVenueModal.jsx', dest: 'features/venues/BookVenueModal.jsx' },
  // Bookings
  { src: 'components/Modals/BookingsModal.jsx', dest: 'features/bookings/BookingsModal.jsx' },
  { src: 'components/Modals/FavoritesModal.jsx', dest: 'features/bookings/FavoritesModal.jsx' },
];

filesToMove.forEach(({ src, dest }) => {
  const srcPath = path.join(clientSrc, src);
  const destPath = path.join(clientSrc, dest);

  if (!fs.existsSync(srcPath)) {
    console.log(`Skipping: ${srcPath} does not exist.`);
    return;
  }

  // Ensure dest directory exists
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Move the file
  fs.renameSync(srcPath, destPath);
  console.log(`Moved ${src} to ${dest}`);
});

console.log('All files moved successfully!');
