// src/features/tradeSummary/tradeSummarySlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios';

// Async thunk to fetch trade summary for logged-in user
export const fetchTradeSummary = createAsyncThunk(
  'tradeSummary/fetchTradeSummary',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('stocks/tradesummary/'); 
      console.log('Trade Summary response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching trade summary:', error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const fetchMonthlyPL = createAsyncThunk(
  'tradeSummary/fetchMonthlyPL',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('stocks/monthlypl/');
      console.log('Monthly PL response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly PL:', error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const fetchMonthlyROI = createAsyncThunk(
  'tradeSummary/fetchMonthlyROI',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('stocks/monthlyroi/');  // new endpoint
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);


const tradeSummarySlice = createSlice({
  name: 'tradeSummary',
  initialState: {
    summary: [],
    monthlyPL: [],
    monthlyROI: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTradeSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTradeSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.summary = action.payload; // store trade summary data
      })
      .addCase(fetchTradeSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(fetchMonthlyPL.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyPL.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.monthlyPL = action.payload;  // store monthly PL
      })
      .addCase(fetchMonthlyPL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMonthlyROI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyROI.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.monthlyROI = action.payload;  
      })
      .addCase(fetchMonthlyROI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },
});

export default tradeSummarySlice.reducer;
export const selectPositiveSum = (state) =>
  state.tradeSummary.summary
    .filter((item) => item.pl > 0) // replace `value` with your actual field
    .reduce((sum, item) => sum + item.pl, 0);

export const selectNegativeSum = (state) =>
  state.tradeSummary.summary
    .filter((item) => item.pl < 0) // replace `value` with your actual field
    .reduce((sum, item) => sum + item.pl, 0);

