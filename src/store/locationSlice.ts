import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  currentLocation: string;
  isLocating: boolean;
}

const initialState: LocationState = {
  currentLocation: '',
  isLocating: true,
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
    setIsLocating: (state, action: PayloadAction<boolean>) => {
      state.isLocating = action.payload;
    }
  },
});

export const { setLocation, setIsLocating } = locationSlice.actions;
export default locationSlice.reducer;
