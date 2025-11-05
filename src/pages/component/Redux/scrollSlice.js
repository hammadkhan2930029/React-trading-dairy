// scrollSlice.js
import { createSlice } from '@reduxjs/toolkit';

const scrollSlice = createSlice({
  name: 'scroll',
  initialState: {
    scrollToSection: null,
  },
  reducers: {
    setScrollToSection: (state, action) => {
      state.scrollToSection = action.payload;
    },
    clearScrollToSection: (state) => {
      state.scrollToSection = null;
    },
  },
});

export const { setScrollToSection ,clearScrollToSection} = scrollSlice.actions;
export default scrollSlice.reducer;
