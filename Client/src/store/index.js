import { configureStore } from '@reduxjs/toolkit';
import venueReducer from './venueSlice';

export const store = configureStore({
  reducer: {
    venue: venueReducer
  }
});
