import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";


// ----------------- Async Thunks -----------------

// Fetch all brokers linked to authenticated user
export const fetchUserBrokers = createAsyncThunk(
  "userBrokers/fetchUserBrokers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("broker/user-brokers/"); // DRF endpoint
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetching user brokers failed");
    }
  }
);

// Add a broker for the authenticated user
export const createUserBroker = createAsyncThunk(
  "userBrokers/createUserBroker",
  async (brokerId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = state.auth.user.id; // depends on how you store auth user
      const response = await api.post("broker/user-brokers/", { 
        broker: brokerId,
        
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create broker");
    }
  }
);

// Update a broker for the authenticated user
export const updateUserBroker = createAsyncThunk(
  "userBrokers/updateUserBroker",
  async ({ id, broker, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`broker/user-brokers/${id}/`, {
        status,
      });
      return response.data;
    } catch (err) {
      if (err.response?.data?.detail === "No change updated") {
        return rejectWithValue("No change updated");
      }
      return rejectWithValue(err.response?.data || "Failed to update broker");
    }
    
  }
);



// ----------------- Slice -----------------

const userBrokerSlice = createSlice({
  name: "userBrokers",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    createStatus: "idle",
    createError: null,
  },
  reducers: {
    clearUserBrokerStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.createStatus = "idle";
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- fetchUserBrokers lifecycle ---
      .addCase(fetchUserBrokers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserBrokers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchUserBrokers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch brokers";
        state.list = [];
      })

      // --- createUserBroker lifecycle ---
      .addCase(createUserBroker.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createUserBroker.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.list.push(action.payload);
        state.createError = null;
      })
      .addCase(createUserBroker.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Failed to create broker";
      })
      .addCase(updateUserBroker.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserBroker.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updated = action.payload;
        // Replace the broker in state.list
        const index = state.list.findIndex((b) => b.id === updated.id);
        if (index !== -1) {
          state.list[index] = updated;
        }
      })
      .addCase(updateUserBroker.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update broker";
      });

     
  },
});

// ----------------- Exports -----------------

export default userBrokerSlice.reducer;
export const { clearUserBrokerStatus } = userBrokerSlice.actions;
export const selectAllUserBrokers = (state) => state.userBrokers.list;
