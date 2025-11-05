// File: holdingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios';


// Async Thunk to fetch ALL holding for the authenticated user
export const fetchHoldings = createAsyncThunk('holdings/fetchHoldings',async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('holdings/holdings/');
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Fetching holdingss failed');
    }
    console.log('Holdings fetched successfully:', response.data);
  }
);

// in Async Thunk to add a holding to the journal
export const addToJournal = createAsyncThunk(
  'holdings/addToJournal',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`holdings/holdings/${id}/`, {
        in_journal: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to add to journal');
    }
  }
);



const holdingSlice = createSlice({
  name: 'holdings', 
  initialState: {
    items: [],       
    loading: 'idle', 
    error: null,     
  },
  reducers: {    
    clearHoldings: (state) => {
      state.items = [];
      state.loading = 'idle';
      state.error = null;
    },
  },
  // extraReducers handle actions dispatched by createAsyncThunk
  extraReducers: (builder) => {
    builder
      .addCase(fetchHoldings.pending, (state) => {
        state.loading = 'pending'; 
        state.error = null;        
      })
      .addCase(fetchHoldings.fulfilled, (state, action) => {
        state.loading = 'succeeded'; 
        state.items = action.payload; 
      })
     .addCase(fetchHoldings.rejected, (state, action) => {
        state.loading = 'failed'; 
        state.error = action.payload || 'Failed to fetch holdings'; 
      })
      .addCase(addToJournal.fulfilled, (state, action) => {
      // Update only that holding in the state
      const updated = action.payload;
      const index = state.items.findIndex((h) => h.id === updated.id);
      if (index !== -1) {
        state.items[index] = updated;
      }
    })
    .addCase(addToJournal.rejected, (state, action) => {
      state.error = action.payload || 'Failed to add to journal';
    });
  },
});

export const { clearHoldings } = holdingSlice.actions;
export default holdingSlice.reducer;
//const selectAllHoldings = (state) => state.holdings.items;
export const selectAllHoldings = (state) => state.holdings.items;
