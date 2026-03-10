import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../../api/axios"; 

// Async thunk to create a rightShare in DB at backend
export const createrightShare = createAsyncThunk('rightShare/create',async (values, { rejectWithValue }) => {
 try {
      const response = await api.post('rightshares/rightshares/', {
      stock:    Number(values.stock),
      date: values.date,
      credit_date: values.credit_date,
      cur_shares:    Number(values.cur_shares),
      right_shares_percent:    Number(values.right_shares_percent),
      right_shares:    Number(values.right_shares),
      right_share_rate:    Number(values.right_shares_rate),
      total_amount:    Number(values.total_amount),
      status:    Number(values.status),
      rs_status: values.rs_status,
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

// Async thunk to fetch rightShares from backend
export const fetchrightShare = createAsyncThunk('fetch/fetchrightShare', async (_, thunkAPI) => {
  try {
      const response = await api.get('rightshares/rightshares/');
      return response.data; // This data will be the array of all rightShares
  } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Fetching rightShare failed');
  }
});

// Async thunk to update rightShare at backend
export const updaterightShare = createAsyncThunk('rightShare/updaterightShare', async ({ id, updatedData }, thunkAPI) => {
    try {
        const payloadToSend = {
            stock: Number(updatedData.stock), 
            date: updatedData.date,
            credit_date: updatedData.credit_date,
            cur_shares: Number(updatedData.cur_shares),
            right_shares_percent: Number(updatedData.right_shares_percent),
            right_shares: Number(updatedData.right_shares),
            right_share_rate: Number(updatedData.right_shares_rate),
            total_amount: Number(updatedData.total_amount),
            rs_status: updatedData.rs_status,
        };

        const response = await api.put(`rightshares/rightshares/${id}/`, payloadToSend);
        
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            
            return thunkAPI.rejectWithValue(error.response.data);
        } else {
            
            return thunkAPI.rejectWithValue(error.message);
        }
    }
});


const rightShareSlice = createSlice({
    name: 'rightShare',
    initialState: {
        rightShares: [], 
        status: 'idle', 
        error: null,
    },
    reducers: {
        clearrightShareStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
      builder
         .addCase(createrightShare.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(createrightShare.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.rightShares.push(action.payload);              
              state.error = null;
          })
          .addCase(createrightShare.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload || action.error.message;
          })
         
          .addCase(fetchrightShare.pending, (state) => {
              state.status = 'loading';
              state.error = null; 
          })
          .addCase(fetchrightShare.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.rightShares = action.payload; 
              state.error = null;
          })
          .addCase(fetchrightShare.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload || action.error.message;
          })
        .addCase(updaterightShare.pending, (state) => {
                state.status = 'loading'; // Use 'status' for overall loading state
                state.error = null;
        })
        .addCase(updaterightShare.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Find the updated rightShare by ID and replace it in the array
            const index = state.rightShares.findIndex(rightShare => rightShare.id === action.payload.id);
            if (index !== -1) {
                state.rightShares[index] = action.payload; // Replace old rightShare with updated one
            }
            state.error = null;
        })
        .addCase(updaterightShare.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || action.error.message;
        });
    },
});

export default rightShareSlice.reducer;
export const { clearrightShareStatus } = rightShareSlice.actions;
export const selectrightShareStatus = (state) => state.rightShare.status;
export const selectrightShareError = (state) => state.rightShare.error;
export const selectAllrightShares = (state) => state.rightShare.rightShares;
