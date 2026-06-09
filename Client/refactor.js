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
  // Notifications
  { src: 'components/Modals/NotificationDropdown.jsx', dest: 'features/notifications/NotificationDropdown.jsx' },
];

filesToMove.forEach(({ src, dest }) => {
  const srcPath = path.join(clientSrc, src);
  const destPath = path.join(clientSrc, dest);

  if (!fs.existsSync(srcPath)) return;

  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Read content to update imports
  let content = fs.readFileSync(srcPath, 'utf8');

  // Update imports based on file type
  if (src === 'components/Header.jsx') {
    content = content.replace("./Modals/NotificationDropdown", "../../features/notifications/NotificationDropdown");
  } else if (src === 'components/Modals/BookVenueModal.jsx' || src === 'components/Modals/FavoritesModal.jsx' || src === 'components/Modals/ListVenueModal.jsx' || src === 'components/Modals/BookingsModal.jsx') {
    content = content.replace(/lucide-react/g, "lucide-react");
    // These modals might import Button or Input, but since we just made them, they probably just use raw HTML right now.
  }

  // Move the file
  fs.writeFileSync(destPath, content);
  fs.unlinkSync(srcPath);
  console.log(`Moved ${src} to ${dest}`);
});

console.log('Restructure complete!');
