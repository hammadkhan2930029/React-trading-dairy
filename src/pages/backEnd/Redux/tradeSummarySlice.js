// src/features/tradeSummary/tradeSummarySlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios';

// Async thunk to fetch trade summary for logged-in user
export const fetchTradeSummary = createAsyncThunk(
  'tradeSummary/fetchTradeSummary',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('stocks/tradesummary/'); 
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const fetchMonthlyPL = createAsyncThunk(
  'tradeSummary/fetchMonthlyPL',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('stocks/monthlypl/');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const fetchMonthlyRealizedPL = createAsyncThunk(
  'tradeSummary/fetchMonthlyRealizedPL',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('stocks/monthlyrealizedpl/');
      return response.data;
    } catch (error) {
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

export const fetchMonthlyROIClosedTrade = createAsyncThunk(
  'tradeSummary/fetchMonthlyROIClosedTrade',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('stocks/monthlyroi/closedtrades/');  // new endpoint
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const fetchMonthlyPLClosedTrade = createAsyncThunk(
  'tradeSummary/fetchMonthlyPLClosedTrade',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('stocks/monthlypl/closedtrades/');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const fetchHighestROIClosedTrade = createAsyncThunk(
  'tradeSummary/fetchHighestROIClosedTrade',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('stocks/highestroi/closedtrades/');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const fetchLowestROIClosedTrade = createAsyncThunk(
  'tradeSummary/fetchLowestROIClosedTrade',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('stocks/lowestroi/closedtrades/');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const fetchTradeSummaryClosedTrade = createAsyncThunk(
  'tradeSummary/fetchTradeSummaryClosedTrade',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('stocks/tradesummary/closedtrades/'); 
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const fetchROIClosedTrade = createAsyncThunk(
  'tradeSummary/fetchROIClosedTrade',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('stocks/roi/closedtrades/'); 
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
    summaryClosedTrade: [],
    monthlyPL: [],
    monthlyPLClosedTrade: [],
    monthlyROI: [],
    monthlyROIClosedTrade: [],
    highestROIClosedTrade: [],
    lowestROIClosedTrade: [],
    roiClosedTrade: [],
    monthlyRealizedPL: [],
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
       .addCase(fetchMonthlyRealizedPL.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyRealizedPL.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.monthlyRealizedPL = action.payload;  // store monthly PL
      })
      .addCase(fetchMonthlyRealizedPL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(fetchMonthlyPLClosedTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyPLClosedTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.monthlyPLClosedTrade = action.payload;  // store monthly PL
      })
      .addCase(fetchMonthlyPLClosedTrade.rejected, (state, action) => {
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
      })
      .addCase(fetchMonthlyROIClosedTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyROIClosedTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.monthlyROIClosedTrade = action.payload;  
      })
      .addCase(fetchMonthlyROIClosedTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHighestROIClosedTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHighestROIClosedTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.highestROIClosedTrade = action.payload;  
      })
      .addCase(fetchHighestROIClosedTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })      
      .addCase(fetchLowestROIClosedTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLowestROIClosedTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.lowestROIClosedTrade = action.payload;  
      })
      .addCase(fetchLowestROIClosedTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })      
      .addCase(fetchTradeSummaryClosedTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTradeSummaryClosedTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.summaryClosedTrade = action.payload;  
      })
      .addCase(fetchTradeSummaryClosedTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })      
      .addCase(fetchROIClosedTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchROIClosedTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.roiClosedTrade = action.payload.data || []; // <-- store the array directly
      })
      .addCase(fetchROIClosedTrade.rejected, (state, action) => {
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

export const selectMonthlyROIClosedTrade = (state) =>
  state.tradeSummary.monthlyROIClosedTrade;

