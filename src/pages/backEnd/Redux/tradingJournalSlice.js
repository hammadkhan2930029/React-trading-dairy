import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api/axios'; 

// Async Thunk to fetch ALL trading journal entries for the authenticated user
export const fetchTradingJournal = createAsyncThunk('tradingjournal/fetchtradingjournal',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('tradingjournal/');
      console.log('Trading journal fetched successfully:', response.data); 
      return response.data;
    } catch (err) {
      console.error('Fetching trading journal failed:', err.response?.data || err.message); 
      return rejectWithValue(err.response?.data || 'Fetching trading journal failed');
    }
  }
);

// Async Thunk to fetch single user trading journal entrryfor the authenticated user
export const getTradingJournalById = createAsyncThunk('tradingjournal/getTradingJournalById',
    async (id, { rejectWithValue }) => {
        try {
            // Adjust this API endpoint if it's different in your backend (e.g., 'tradingjournal/detail/${id}/')
            const response = await api.get(`tradingjournal/${id}/`);
            console.log(`Trading journal ID ${id} fetched successfully:`, response.data);
            return response.data;
        } catch (err) {
            console.error(`Fetching trading journal ID ${id} failed:`, err.response?.data || err.message);
            return rejectWithValue(err.response?.data || `Fetching trading journal ID ${id} failed`);
        }
    }
);
// Async Thunk to create a new trading journal entry
export const createTradingJournal = createAsyncThunk('tradingjournal/createTradingJournal',
  async (journalData, { rejectWithValue }) => {
    try {
      const response = await api.post('tradingjournal/', journalData);
      console.log('Trading journal created successfully:', response.data); 
      return response.data;
    } catch (err) {
      console.error('Creating trading journal failed:', err.response?.data || err.message); 
      return rejectWithValue(err.response?.data || 'Creating trading journal failed');
    }
  }
);



export const updateTradingJournal = createAsyncThunk(
  'tradingjournal/updateTradingJournal',
  async (journalData, { rejectWithValue }) => {
    try {
      console.log("📤 Payload being sent:", journalData);
      const response = await api.put(`tradingjournal/${journalData.id}/`, journalData);
      console.log("✅ Update successful:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ Update error response:", err.response?.data); // Show actual error
      return rejectWithValue(err.response?.data || 'Update failed');
    }
  }
);

export const fetchTradeStats = createAsyncThunk( 'tradingjournal/fetchTradeStats',  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('tradingjournal/closed_trades_count/'); 
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch trade stats');
    }
  }
);

const tradingJournalSlice = createSlice({
  name: "tradingJournal",
  initialState: {
    items: [],
    currentJournalEntry: null, 
    selectedJournalId: null,
    loading: false,
    error: null,
    formType: null, 
    tradeStats: {
      total_trade_count: 0,
      closed_trades_count: 0,
      open_trades_count: 0,
                 },
  },
  reducers: {
    setJournal_from: (state) => {
      state.selectedJournalId = null; 
      state.currentJournalEntry = null
      state.formType = 5;
    },
    setTradingJournal_from: (state) => {
      state.selectedJournalId = null;
      state.currentJournalEntry = null;
      state.formType = 6;
    },
    setTradingJournal_View: (state, action) => {
      state.formType = 7;
      state.selectedJournalId = action.payload;
    },
    setTradingJournal_EditForm: (state, action) => {
      state.formType = 8;
      state.selectedJournalId = action.payload;
    },
    reset: (state) => {
      state.formType = null;
      state.selectedJournalId = null;
      state.currentJournalEntry = null;
    },
     setSelectedJournalId: (state, action) => {
            state.selectedJournalId = action.payload;
        },
  },
  // extraReducers handle actions dispatched by createAsyncThunk
  extraReducers: (builder) => {
    builder
      // Cases for fetchTradingjournal
      .addCase(fetchTradingJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTradingJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTradingJournal.rejected, (state, action) => {
         state.loading = false;
        state.error = action.payload;
      })
      // Cases for createTradingJournal
      .addCase(createTradingJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTradingJournal.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.items.push(action.payload); 
      })
      .addCase(createTradingJournal.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      .addCase(getTradingJournalById.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
        state.currentJournalEntry = null; 
    })
      .addCase(getTradingJournalById.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.currentJournalEntry = action.payload; 
    })
      .addCase(getTradingJournalById.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
        state.currentJournalEntry = null; 
    })
    .addCase(updateTradingJournal.pending, (state) => {
        state.loading = 'pending'; // You might want a specific 'loadingUpdate' state here
        state.error = null;
    })
    .addCase(updateTradingJournal.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        // Find the updated journal in the 'items' array and replace it
        const index = state.items.findIndex(journal => (journal._id || journal.id) === (action.payload._id || action.payload.id));
        if (index !== -1) {
            state.items[index] = action.payload;
        }
        // If the updated item was the current one being viewed/edited, update it too
        if (state.currentJournalEntry && (state.currentJournalEntry._id || state.currentJournalEntry.id) === (action.payload._id || action.payload.id)) {
            state.currentJournalEntry = action.payload;
        }
        })
      .addCase(updateTradingJournal.rejected, (state, action) => {
              state.loading = false; 
              state.error = action.payload;
          })
      .addCase(fetchTradeStats.pending, (state) => {
          state.loading = true;
          })
      .addCase(fetchTradeStats.fulfilled, (state, action) => {
            state.loading = true;
            state.tradeStats = action.payload;
          })
      .addCase(fetchTradeStats.rejected, (state, action) => {
            state.loading = flase;
            state.error = action.payload;
          })
      

  },
});

export const {setTradingJournal_View,setTradingJournal_from, reset,setTradingJournal_EditForm,
  setJournal_from,setSelectedJournalId} = tradingJournalSlice.actions;
export default tradingJournalSlice.reducer;
export const selectAllTradingJournal = (state) => state.tradingJournal.items;
export const selectCurrentJournalEntry = (state) => state.tradingJournal.currentJournalEntry;
export const selectJournalById = (state, journalId) =>
    state.tradingJournal.items.find(journal => (journal._id || journal.id) === journalId);
export const selectTradeStats = (state) => state.tradingJournal.tradeStats;
