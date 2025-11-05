import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../api/axios'; // Adjust path if needed

// Async thunk to fetch closed trades count
export const fetchCloseCounter = createAsyncThunk(
  'closeCounter/fetch',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('holdings/closedcount/');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const closeCounterSlice = createSlice({
  name: 'closeCounter',
  initialState: {
    count: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCloseCounter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCloseCounter.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.count = action.payload.count || action.payload['closed_trades_count'] || 0;

      })
      .addCase(fetchCloseCounter.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const selectCloseTradeCount = (state) => state.closeCounter?.count ?? 0;
export const selectCloseTradeStatus = (state) => state.closeCounter.status;
export const selectCloseTradeError = (state) => state.closeCounter.error;

export default closeCounterSlice.reducer;
