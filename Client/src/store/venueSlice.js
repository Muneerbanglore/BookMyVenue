import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_VENUES = [
  {
    id: 'crystal-waterfront',
    name: 'The Crystal Waterfront Pavilion',
    location: 'Geneva, Switzerland',
    capacity: 'Up to 500 guests',
    type: 'Wedding',
    rating: '4.9',
    isTopRated: true,
    price: 3200,
    image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=1200&q=80',
    description: 'A masterpiece of architecture, combining glass walls and premium design overlooking the serene lake.'
  },
  {
    id: 'skyline-loft',
    name: 'Skyline Loft Lounge',
    location: 'New York, USA',
    capacity: 'Up to 150 guests',
    type: 'Corporate',
    rating: '4.8',
    isTopRated: false,
    price: 2400,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    description: 'A stylish, industrial warehouse loft situated in the heart of Manhattan featuring panoramic city views.'
  },
  {
    id: 'villa-rosa',
    name: 'Villa de la Rosa',
    location: 'Tuscany, Italy',
    capacity: 'Up to 250 guests',
    type: 'Wedding',
    rating: '4.9',
    isTopRated: false,
    price: 4500,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    description: 'An elegant Tuscan villa surrounded by vineyards and gorgeous climbing bougainvillea blooms.'
  },
  {
    id: 'royal-palace',
    name: 'The Amber Palace Gardens',
    location: 'Jaipur, India',
    capacity: 'Up to 1000 guests',
    type: 'Social',
    rating: '5.0',
    isTopRated: true,
    price: 6000,
    image: 'https://images.unsplash.com/photo-1585128792020-803d29415281?auto=format&fit=crop&w=1200&q=80',
    description: 'A grand heritage palace offering expansive manicured royal lawns and stunning Mughal architecture.'
  },
  {
    id: 'tokyo-glass',
    name: 'Kyoto Glasshouse Studio',
    location: 'Kyoto, Japan',
    capacity: 'Up to 80 guests',
    type: 'Exhibition',
    rating: '4.7',
    isTopRated: false,
    price: 1800,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    description: 'A tranquil glasshouse surrounded by bamboo forests, ideal for intimate gatherings and art showings.'
  }
];

const initialState = {
  venues: DEFAULT_VENUES,
  bookings: [
    {
      id: 'b1',
      venueId: 'crystal-waterfront',
      venueName: 'The Crystal Waterfront Pavilion',
      date: '2026-06-15',
      eventType: 'Wedding',
      status: 'Confirmed',
      createdAt: '2026-05-28'
    }
  ],
  favorites: ['crystal-waterfront'],
  searchFilters: {
    location: '',
    date: '',
    eventType: 'Wedding'
  },
  searchResults: null, // null means show all, empty array means no matches
  currentUser: null,
  notifications: [
    {
      id: 'n1',
      message: 'Welcome to VenueElite! Explore premium spaces.',
      type: 'info',
      time: 'Just now',
      read: false
    },
    {
      id: 'n2',
      message: 'Booking confirmed for The Crystal Waterfront Pavilion.',
      type: 'success',
      time: '2 hours ago',
      read: true
    }
  ]
};

export const venueSlice = createSlice({
  name: 'venue',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const venueId = action.payload;
      const index = state.favorites.indexOf(venueId);
      if (index >= 0) {
        state.favorites.splice(index, 1);
        state.notifications.unshift({
          id: 'n_' + Date.now(),
          message: 'Removed from Favorites',
          type: 'info',
          time: 'Just now',
          read: false
        });
      } else {
        state.favorites.push(venueId);
        state.notifications.unshift({
          id: 'n_' + Date.now(),
          message: 'Added to Favorites!',
          type: 'success',
          time: 'Just now',
          read: false
        });
      }
    },
    addBooking: (state, action) => {
      const newBooking = {
        id: 'b_' + Date.now(),
        status: 'Confirmed',
        createdAt: new Date().toISOString().split('T')[0],
        ...action.payload
      };
      state.bookings.unshift(newBooking);
      state.notifications.unshift({
        id: 'n_' + Date.now(),
        message: `Successfully booked ${newBooking.venueName}!`,
        type: 'success',
        time: 'Just now',
        read: false
      });
    },
    addVenue: (state, action) => {
      const newVenue = {
        id: 'v_' + Date.now(),
        rating: '4.8',
        isTopRated: false,
        image: action.payload.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80',
        ...action.payload
      };
      state.venues.unshift(newVenue);
      state.notifications.unshift({
        id: 'n_' + Date.now(),
        message: `New venue "${newVenue.name}" successfully listed!`,
        type: 'success',
        time: 'Just now',
        read: false
      });
    },
    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    triggerSearch: (state) => {
      const { location, eventType } = state.searchFilters;

      // Filter logically
      state.searchResults = state.venues.filter(venue => {
        const matchesLocation = !location ||
          venue.location.toLowerCase().includes(location.toLowerCase()) ||
          venue.name.toLowerCase().includes(location.toLowerCase());

        const matchesType = !eventType ||
          venue.type.toLowerCase() === eventType.toLowerCase();

        return matchesLocation && matchesType;
      });

      state.notifications.unshift({
        id: 'n_' + Date.now(),
        message: `Search completed. Found ${state.searchResults.length} spaces.`,
        type: 'info',
        time: 'Just now',
        read: false
      });
    },
    clearSearch: (state) => {
      state.searchFilters = { location: '', date: '', eventType: 'Wedding' };
      state.searchResults = null;
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: 'n_' + Date.now(),
        time: 'Just now',
        read: false,
        ...action.payload
      });
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications = state.notifications.map(n => ({ ...n, read: true }));
    },
    loginUser: (state, action) => {
      const { name = 'User', email, role = 'Client', avatar } = action.payload;
      state.currentUser = {
        id: 'u_' + Date.now(),
        name,
        email,
        role,
        avatar: avatar || (name.split(' ').map(n => n[0]).join('').toUpperCase())
      };
      state.notifications.unshift({
        id: 'n_' + Date.now(),
        message: `Welcome back, ${state.currentUser.name}!`,
        type: 'success',
        time: 'Just now',
        read: false
      });
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.notifications.unshift({
        id: 'n_' + Date.now(),
        message: 'Logged out successfully.',
        type: 'info',
        time: 'Just now',
        read: false
      });
    }
  }
});

export const {
  toggleFavorite,
  addBooking,
  addVenue,
  setSearchFilters,
  triggerSearch,
  clearSearch,
  addNotification,
  markAllNotificationsAsRead,
  loginUser,
  logoutUser
} = venueSlice.actions;

export default venueSlice.reducer;
