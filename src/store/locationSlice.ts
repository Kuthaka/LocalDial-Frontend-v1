import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  currentLocation: string;
  latitude: number | null;
  longitude: number | null;
  isLocating: boolean;
}

const initialState: LocationState = {
  currentLocation: '',
  latitude: null,
  longitude: null,
  isLocating: true,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<{ name: string; lat: number | null; lng: number | null }>) => {
      state.currentLocation = action.payload.name;
      state.latitude = action.payload.lat;
      state.longitude = action.payload.lng;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userLocation', action.payload.name);
        if (action.payload.lat && action.payload.lng) {
          localStorage.setItem('userLat', action.payload.lat.toString());
          localStorage.setItem('userLng', action.payload.lng.toString());
        } else {
          localStorage.removeItem('userLat');
          localStorage.removeItem('userLng');
        }
      }
    },
    setIsLocating: (state, action: PayloadAction<boolean>) => {
      state.isLocating = action.payload;
    }
  },
});

export const { setLocation, setIsLocating } = locationSlice.actions;
export default locationSlice.reducer;
