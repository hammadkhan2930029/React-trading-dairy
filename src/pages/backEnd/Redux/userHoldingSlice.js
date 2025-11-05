import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios'; 



// Async thunk to fetch only holdings where quantity > 0
export const fetchUserHoldings = createAsyncThunk(
  'userHoldings/fetchUserHoldings',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('holdings/userholdings/'); 
      console.log('✅ User Holdings response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user holdings:', error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const userHoldingsSlice = createSlice({
  name: 'userHoldings',
  initialState: {
    holdings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserHoldings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserHoldings.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.holdings = action.payload; // store only user buyed holdings
      })
      .addCase(fetchUserHoldings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userHoldingsSlice.reducer;
