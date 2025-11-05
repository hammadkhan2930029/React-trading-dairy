// src/store/brokerSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../../api/axios"; 

// Async thunk to create a broker
export const createBrokers = createAsyncThunk( "brokers/createBroker", async (values, { rejectWithValue }) => {
    try {
      const response = await api.post('broker/broker/', {
        broker_name: values.broker_name,
        charges_1: Number(values.charges_1),
        charges_2: Number(values.charges_2),
        charges_3: Number(values.charges_3),
      });
      return response.data;
    } catch (error) {
      // Better error handling
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// Async thunk to fetch broker list from backend
export const fetchBrokerlist = createAsyncThunk('fetch/fetchBrokers', async (_, thunkAPI) => {
  try {
    const response = await api.get('broker/broker/');
    console.log(response.data)
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || 'Fetching Brokers failed');
  }
});

const brokerSlice = createSlice({
  name: "brokers",
  initialState: {
    brokers: [],
    loading: false,
    error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
      .addCase(createBrokers.pending, (state) => {
      state.loading = 'pending';
      state.error = null;
      })
      .addCase(createBrokers.fulfilled, (state, action) => {
      state.loading = 'fulfilled';
      state.brokers.push(action.payload); // append newly created broker
      })
      .addCase(createBrokers.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.payload || "Failed to create broker";
      })
      .addCase(fetchBrokerlist.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchBrokerlist.fulfilled, (state, action) => {
        state.loading = 'fullfilled';
        state.brokers = action.payload;
      })
      .addCase(fetchBrokerlist.rejected, (state, action) => {
        state.loading = 'fail';
        state.error = action.payload || action.error.message;
      });
},
});

export const selectAllBrokers = (state) => state.brokers.brokers;
export const selectBrokersLoading = (state) => state.brokers.loading;
export const selectBrokersError = (state) => state.brokers.error;
export default brokerSlice.reducer;