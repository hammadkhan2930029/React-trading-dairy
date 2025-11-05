import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../api/axios'; // Your axios instance

export const fetchTradeCounter = createAsyncThunk(
  'tradeCounter/fetch',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('holdings/tradecounter/');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const tradeCounterSlice = createSlice({
  name: 'tradeCounter',
  initialState: {
    count: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTradeCounter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTradeCounter.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.count = action.payload.count;
      })
      .addCase(fetchTradeCounter.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});



export const selectTradeCount = (state) => state.tradecounter?.count ?? 0;

export default tradeCounterSlice.reducer;