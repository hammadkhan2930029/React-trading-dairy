import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../../api/axios"; 

// Async thunk to create a split in DB at backend
export const createsplit = createAsyncThunk('split/create',async (values, { rejectWithValue }) => {
 try {
      const response = await api.post('split/split/', {
      stock:    Number(values.stock),
      date: values.date,
      credit_date: values.credit_date,
      ratio_from:    Number(values.ratio_from),
      ratio_to:    Number(values.ratio_to),
      cur_shares:    Number(values.cur_shares),
      cur_rate:    Number(values.cur_rate),
      total_investment:    Number(values.total_investment),
      new_shares:    Number(values.new_shares),
      new_rate:    Number(values.new_rate),
      tax: Number(values.tax),
      net_shares: Number(values.net_shares),
    });


    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue(error.message || "Unknown error");
  }
}
);

// Async thunk to fetch splits from backend
export const fetchsplit = createAsyncThunk('fetch/fetchsplit', async (_, thunkAPI) => {
  try {
      const response = await api.get('split/split/');
      return response.data; // This data will be the array of all splits
  } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Fetching split failed');
  }
});

// Async thunk to update split at backend
export const updatesplit = createAsyncThunk('split/updatesplit', async ({ id, updatedData }, thunkAPI) => {
    try {
        const payloadToSend = {
            stock: Number(updatedData.stock), 
            date: updatedData.date,
            credit_date: updatedData.credit_date,
            ratio_from: Number(updatedData.ratio_from),
            ration_to: Number(updatedData.ration_to),
            cur_shares: Number(updatedData.cur_shares),
            cur_rate: Number(updatedData.cur_rate),
            total_investment: Number(updatedData.total_investment),
            new_shares: Number(updatedData.new_shares),
            new_rate: Number(updatedData.new_rate),
            tax: Number(updatedData.tax),
            net_shares: Number(updatedData.net_shares),
        };

        const response = await api.put(`split/split/${id}/`, payloadToSend);
        
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            
            return thunkAPI.rejectWithValue(error.response.data);
        } else {
            
            return thunkAPI.rejectWithValue(error.message);
        }
    }
});


const splitSlice = createSlice({
    name: 'split',
    initialState: {
        splits: [], 
        status: 'idle', 
        error: null,
    },
    reducers: {
        clearsplitStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
      builder
         .addCase(createsplit.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(createsplit.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.splits.push(action.payload);              
              state.error = null;
          })
          .addCase(createsplit.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload || action.error.message;
          })
         
          .addCase(fetchsplit.pending, (state) => {
              state.status = 'loading';
              state.error = null; 
          })
          .addCase(fetchsplit.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.splits = action.payload; 
              state.error = null;
          })
          .addCase(fetchsplit.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload || action.error.message;
          })
        .addCase(updatesplit.pending, (state) => {
                state.status = 'loading'; // Use 'status' for overall loading state
                state.error = null;
        })
        .addCase(updatesplit.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Find the updated split by ID and replace it in the array
            const index = state.splits.findIndex(split => split.id === action.payload.id);
            if (index !== -1) {
                state.splits[index] = action.payload; // Replace old split with updated one
            }
            state.error = null;
        })
        .addCase(updatesplit.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || action.error.message;
        });
    },
});

export default splitSlice.reducer;
export const { clearsplitStatus } = splitSlice.actions;
export const selectsplitStatus = (state) => state.split.status;
export const selectsplitError = (state) => state.split.error;
export const selectAllsplits = (state) => state.split.splits;
