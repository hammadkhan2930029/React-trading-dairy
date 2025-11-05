

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios'; 

// Async thunk to fetch the total profit and total loss
export const fetchTotalProfitLoss = createAsyncThunk(
  'profitLoss/fetchTotalProfitLoss',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('holdings/totalpl/'); 
      console.log('✅ Total P/L response:', response.data);
      return response.data; // The response should contain { total_profit, total_loss }
    } catch (error) {
      console.error('❌ Error fetching total P/L:', error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const profitLossSlice = createSlice({
  name: 'profitLoss',
  initialState: {
    totalProfit: '0.00',
    totalLoss: '0.00',
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalProfitLoss.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalProfitLoss.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.totalProfit = action.payload.total_profit;
        state.totalLoss = action.payload.total_loss;
      })
      .addCase(fetchTotalProfitLoss.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profitLossSlice.reducer;

