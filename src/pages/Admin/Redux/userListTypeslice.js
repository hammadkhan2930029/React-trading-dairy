import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

// Fetch counts
export const fetchUserCounts = createAsyncThunk(
  "users/fetchCounts",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("accounts/user_counts/");
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to load counts");
    }
  }
);

// Fetch registered users list
export const fetchRegisteredUsers = createAsyncThunk(
  "users/fetchRegistered",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("accounts/registered-users/");
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to load registered users");
    }
  }
);

// Fetch verified users list
export const fetchVerifiedUsers = createAsyncThunk(
  "users/fetchVerified",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("accounts/verified-users/");
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to load verified users");
    }
  }
);

const userListTypeslice = createSlice({
  name: "userType",
  initialState: {
    registered_count: 0,
    verified_count: 0,
    registeredUsers: [],
    verifiedUsers: [],
    status: "idle",
    error: null,
    formType: null, // to toggle between Registered/Verified view
  },
  reducers: {
    setVerifiedusers: (state) => {
      state.formType = 992; // Verified users view
    },
    registeredUsers: (state) => {
      state.formType = 991; // Registered users view
    },
    reset: (state) => {
      state.formType = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCounts.fulfilled, (state, action) => {
        state.registered_count = action.payload.registered_count;
        state.verified_count = action.payload.verified_count;
      })
      .addCase(fetchRegisteredUsers.fulfilled, (state, action) => {
        state.registeredUsers = action.payload;
      })
      .addCase(fetchVerifiedUsers.fulfilled, (state, action) => {
        state.verifiedUsers = action.payload;
      });
  },
});

export const { setBuyForm, setSellForm, setVerifiedusers, registeredUsers,reset,close_Trades } = userListTypeslice.actions;
export default userListTypeslice.reducer;

