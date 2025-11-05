// src/redux/slices/winLossSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios'; 

export const fetchWinLossStats = createAsyncThunk(
  'winLoss/fetchWinLossStats',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('holdings/winloss/');
      console.log('✅ Backend response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const winLossSlice = createSlice({
  name: 'winLoss',
  initialState: {
    win_count: 0,
    loss_count: 0,
    total_trades: 0,
    win_percentage: 0.0,
    loss_percentage: 0.0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWinLossStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWinLossStats.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        Object.assign(state, action.payload);
      })
      .addCase(fetchWinLossStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default winLossSlice.reducer;
