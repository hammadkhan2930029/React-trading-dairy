import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../../api/axios"; 


// Async thunk to create a dividend in DB at backend
export const createdividend = createAsyncThunk('dividend/create',async (values, { rejectWithValue }) => {
 try {
      const response = await api.post('dividend/dividend/', {
      stock:    Number(values.stock),
      total_amount: Number(values.total_amount),
      date: values.date,
      net_amount: Number(values.net_amount),
      tax: Number(values.tax),
    
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

// Async thunk to fetch dividends from backend
export const fetchdividend = createAsyncThunk('fetch/fetchdividend', async (_, thunkAPI) => {
  try {
      const response = await api.get('dividend/dividend/');
      return response.data; // This data will be the array of all dividends
  } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Fetching dividend failed');
  }
});

// Async thunk to update dividend at backend
export const updateDividend = createAsyncThunk('dividend/updateDividend', async ({ id, updatedData }, thunkAPI) => {
    try {
        const payloadToSend = {
            stock: Number(updatedData.stock), 
            total_amount: Number(updatedData.total_amount),
            date: updatedData.date,
            net_amount: Number(updatedData.net_amount),
            tax: Number(updatedData.tax),
             };

        const response = await api.put(`dividend/dividend/${id}/`, payloadToSend);
        console.log('Update response:', response.data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            console.error('Update failed with API errors:', error.response.data);
            return thunkAPI.rejectWithValue(error.response.data);
        } else {
            console.error('Update failed:', error.message);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
});


const dividendSlice = createSlice({
    name: 'dividend',
    initialState: {
        dividends: [], 
        status: 'idle', 
        error: null,
    },
    reducers: {
        clearDividendStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
      builder
         .addCase(createdividend.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(createdividend.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.dividends.push(action.payload);              
              state.error = null;
          })
          .addCase(createdividend.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload || action.error.message;
          })
         
          .addCase(fetchdividend.pending, (state) => {
              state.status = 'loading';
              state.error = null; 
          })
          .addCase(fetchdividend.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.dividends = action.payload; 
              state.error = null;
          })
          .addCase(fetchdividend.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload || action.error.message;
          })
        .addCase(updateDividend.pending, (state) => {
                state.status = 'loading'; // Use 'status' for overall loading state
                state.error = null;
        })
        .addCase(updateDividend.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Find the updated dividend by ID and replace it in the array
            const index = state.dividends.findIndex(dividend => dividend.id === action.payload.id);
            if (index !== -1) {
                state.dividends[index] = action.payload; // Replace old dividend with updated one
            }
            state.error = null;
        })
        .addCase(updateDividend.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || action.error.message;
        });
    },
});

export default dividendSlice.reducer;
export const { clearDividendStatus } = dividendSlice.actions;
export const selectDividendStatus = (state) => state.dividend.status;
export const selectDividendError = (state) => state.dividend.error;
export const selectAllDividends = (state) => state.dividend.dividends;
