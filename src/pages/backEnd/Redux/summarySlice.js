import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

/* ===================== THUNKS ===================== */

export const fetchRecentMarketSummary = createAsyncThunk(
  "summary/fetchRecent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("marketsummary/recentday/");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch data");
    }
  }
);

export const fetchSummaryByFilter = createAsyncThunk(
  "summary/fetchByFilter",
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`marketsummary/filter/?${query}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch filtered data");
    }
  }
);

export const fetchSummaryByDate = createAsyncThunk(
  "summary/fetchByDate",
  async (date, { rejectWithValue }) => {
    try {
      const response = await api.get(`marketsummary/bydate/${date}/`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================== STATE ===================== */

const initialState = {
  items: [],
  selectedSummary: null,
  loading: false,
  error: null,
  message: null,
  formType: null,
};

/* ===================== SLICE ===================== */

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
      state.formType = 12;
    },
    resetSummary: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder

      /* Recent */
      .addCase(fetchRecentMarketSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentMarketSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecentMarketSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Filter (SCRIPT / DATE / BOTH) ✅ */
      .addCase(fetchSummaryByFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchSummaryByFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload)
          ? action.payload
          : [];
        state.message = action.payload?.message || null;
      })
      .addCase(fetchSummaryByFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* By Single Date */
      .addCase(fetchSummaryByDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSummaryByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSummary = action.payload;
        state.formType = 14;
      })
      .addCase(fetchSummaryByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* ===================== EXPORTS ===================== */

export const {
  setMarketSummaryDetails,
  resetSummary,
  setBackToSummary,
  setSelectedSummary,
} = summarySlice.actions;

export default summarySlice.reducer;

export const selectAllsummary = (state) => state.summary.items;
