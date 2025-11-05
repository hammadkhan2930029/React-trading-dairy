import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api/axios'; 

// Async Thunks
export const fetchSummary = createAsyncThunk('summary/fetchSummary', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('marketsummary/marketsummary/'); 
        console.log('Market Summary fetched successfully:', response.data); 
        return response.data; 
    } catch (err) {
        console.error('Fetching market summary failed:', err.response?.data || err.message);
        return rejectWithValue(err.response?.data || 'Fetching market summary failed');
    }
});

export const fetchCurrentDaySummary = createAsyncThunk('summary/fetchCurrentDaySummary', async (_, { rejectWithValue }) => {
    try {
        const today = new Date().toISOString().slice(0, 10); 
        const url = `marketsummary/marketsummary/?date=${today}`; 
        const response = await api.get(url);
        console.log('Current Day Market Summary fetched successfully:', response.data);
        return response.data.length > 0 ? response.data[0] : null; 
    } catch (err) {
        console.error('Fetching current day summary failed:', err.response?.data || err.message);
        return rejectWithValue(err.response?.data || 'Fetching current day summary failed');
    }
});

export const fetchLatestSummary = createAsyncThunk('summary/fetchLatestSummary', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('marketsummary/marketsummary/'); 
        const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        return sorted[0] || null; 
    } catch (err) {
        console.error('Fetching latest summary failed:', err.response?.data || err.message);
        return rejectWithValue(err.response?.data || 'Failed to fetch latest market summary');
    }
});

// summarySlice.js (inside fetchSummary)
export const searchSummary = createAsyncThunk(
  'summary/searchSummary',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const url = `marketsummary/marketsummary/${query ? `?${query}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// ✅ Correct initial state
const initialState = {
    items: [],     
    selectedSummary: null,  
    loading: 'idle', 
    error: null,
    formType: null,  // <-- make sure this is included
};

const summarySlice = createSlice({
    name: "summary",
    initialState,
    reducers: {
        setSelectedSummary: (state, action) => {
            state.selectedSummary = action.payload;
        },
        setMarketSummaryDetails: (state) => {
            state.formType = 14;
        },
        setBackToSummary: (state) => {
            state.formType  = 12;
        },
        resetSummary: (state) => {
            state.formType = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSummary.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(fetchSummary.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchSummary.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchCurrentDaySummary.pending, (state) => {
            state.loading = 'loading';
        })
        .addCase(fetchCurrentDaySummary.fulfilled, (state, action) => {
            state.loading = 'succeeded';
            state.items = action.payload ? [action.payload] : [];
        })
        .addCase(fetchCurrentDaySummary.rejected, (state, action) => {
            state.loading = 'failed';
            state.error = action.error.message;
        })

        .addCase(fetchLatestSummary.pending, (state) => {
            state.loading = 'loading';
        })
        .addCase(fetchLatestSummary.fulfilled, (state, action) => {
            state.loading = 'succeeded';
            state.items = action.payload ? [action.payload] : [];
        })
        .addCase(fetchLatestSummary.rejected, (state, action) => {
            state.loading = 'failed';
            state.error = action.error.message;
        }).addCase(searchSummary.pending, (state) => {
            state.loading = 'pending';
            state.error = null;
        })
        .addCase(searchSummary.fulfilled, (state, action) => {
            state.loading = 'succeeded';
            state.items = action.payload;
        })
        .addCase(searchSummary.rejected, (state, action) => {
            state.loading = 'failed';
            state.error = action.payload;
        });
            
    }
});

export const { setMarketSummaryDetails, resetSummary, setBackToSummary, setSelectedSummary } = summarySlice.actions;
export default summarySlice.reducer;
// Selector
export const selectAllsummary = (state) => state.summary.items;
export const selectSummaryByDate = (state, date) => {
    return state.summary.items.filter(item => item.date === date);
};  
