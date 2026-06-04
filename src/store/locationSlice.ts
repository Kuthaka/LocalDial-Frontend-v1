import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  currentLocation: string;
}

const getInitialLocation = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userLocation') || '';
  }
  return '';
};

const initialState: LocationState = {
  currentLocation: getInitialLocation(),
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<string>) => {
      state.currentLocation = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userLocation', action.payload);
      }
    },
  },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
