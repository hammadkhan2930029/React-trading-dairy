// File: overviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios'; 


// Async Thunk to fetch ALL marketoverview for the authenticated user
export const fetchOverview = createAsyncThunk('overview/fetchOverview', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('marketoverview/marketoverview/'); 
        console.log('Market Overview fetched successfully:', response.data); 
        return response.data; 
    } catch (err) {
        console.error('Fetching overview failed:', err.response?.data || err.message);
        return rejectWithValue(err.response?.data || 'Fetching overview failed');
    }
});

export const fetchCurrentDayOverview = createAsyncThunk('overview/fetchCurrentDayOverview',async (_, { rejectWithValue }) => {
        try {
            // Get today's date in YYYY-MM-DD format, which matches Django's DateField format
            const today = new Date().toISOString().slice(0, 10); 
            // Construct the URL to specifically request data for today's date
            const url = `marketoverview/marketoverview/?date=${today}`; 
            const response = await api.get(url);
            console.log('Current Day Market Overview fetched successfully:', response.data);
            return response.data.length > 0 ? response.data[0] : null; 
        } catch (err) {
            console.error('Fetching current day overview failed:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data || 'Fetching current day overview failed');
        }
    }
);


export const fetchLatestOverview = createAsyncThunk(
  'overview/fetchLatestOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('marketoverview/marketoverview/'); // get all
      const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      return sorted[0] || null; // return latest record
    } catch (err) {
      console.error('Fetching latest overview failed:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data || 'Failed to fetch latest overview');
    }
  }
);



// Corrected: Renamed 'holdingSlice' to 'overviewSlice' and fixed 'name' typo
const overviewSlice = createSlice({
    name: 'overview', // Corrected typo: 'overeview' to 'overview'
    initialState: {
        items: [],       
        loading: 'idle', 
        error: null,     
    },
    reducers: {     
        // Corrected: Renamed from clearHoldings to clearOverview for consistency
        clearOverview: (state) => { 
            state.items = [];
            state.loading = 'idle';
            state.error = null;
        },
    },
    // extraReducers handle actions dispatched by createAsyncThunk
    extraReducers: (builder) => {
        builder
            .addCase(fetchOverview.pending, (state) => {
                state.loading = 'pending'; 
                state.error = null;        
            })
            .addCase(fetchOverview.fulfilled, (state, action) => {
                state.loading = 'succeeded'; 
                state.items = action.payload; 
            })
            .addCase(fetchOverview.rejected, (state, action) => {
                state.loading = 'failed'; 
                state.error = action.payload || 'Failed to fetch overview'; 
            })
             .addCase(fetchCurrentDayOverview.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
                })
             .addCase(fetchCurrentDayOverview.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.items = action.payload ? [action.payload] : []; 
                })
            .addCase(fetchCurrentDayOverview.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload || 'Failed to fetch today\'s overview';
                })            
            .addCase(fetchLatestOverview.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
                })
            .addCase(fetchLatestOverview.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.items = action.payload ? [action.payload] : []; 
                })
            .addCase(fetchLatestOverview.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload || 'Failed to fetch latest overview';
                });
    },
});

// Corrected: Exporting actions and reducer from the correctly named 'overviewSlice'
export const { clearOverview } = overviewSlice.actions;
export const selectAllOverview = (state) => state.overview.items; 
export default overviewSlice.reducer; 
