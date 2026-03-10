import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../../api/axios"; 


// Async thunk to create a bonus in DB at backend
export const createbonus = createAsyncThunk('bonus/create',async (values, { rejectWithValue }) => {
 try {
      const response = await api.post('bonus/bonus/', {
      stock:    Number(values.stock),
      holding_shares:    Number(values.holding_shares),
      date: values.date,
      credit_date: values.credit_date,
      net_shares: Number(values.net_shares),
      tax: Number(values.tax),
      percent: Number(values.percent),    
      new_shares: Number(values.new_shares),    
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

// Async thunk to fetch bonuss from backend
export const fetchbonus = createAsyncThunk('fetch/fetchbonus', async (_, thunkAPI) => {
  try {
      const response = await api.get('bonus/bonus/');
      return response.data; // This data will be the array of all bonuss
  } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Fetching bonus failed');
  }
});

// Async thunk to update bonus at backend
export const updatebonus = createAsyncThunk('bonus/updatebonus', async ({ id, updatedData }, thunkAPI) => {
    try {
        const payloadToSend = {
            stock: Number(updatedData.stock), 
            holding_shares: Number(updatedData.holding_shares),
            date: updatedData.date,
            credit_date: updatedData.credit_date,
            net_shares: Number(updatedData.net_shares),
            tax: Number(updatedData.tax),
            percent: Number(updatedData.percent),
            new_shares: Number(updatedData.new_shares),
        };

        const response = await api.put(`bonus/bonus/${id}/`, payloadToSend);
        
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            
            return thunkAPI.rejectWithValue(error.response.data);
        } else {
            
            return thunkAPI.rejectWithValue(error.message);
        }
    }
});


const bonusSlice = createSlice({
    name: 'bonus',
    initialState: {
        bonuss: [], 
        status: 'idle', 
        error: null,
    },
    reducers: {
        clearbonusStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
      builder
         .addCase(createbonus.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(createbonus.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.bonuss.push(action.payload);              
              state.error = null;
          })
          .addCase(createbonus.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload || action.error.message;
          })
         
          .addCase(fetchbonus.pending, (state) => {
              state.status = 'loading';
              state.error = null; 
          })
          .addCase(fetchbonus.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.bonuss = action.payload; 
              state.error = null;
          })
          .addCase(fetchbonus.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload || action.error.message;
          })
        .addCase(updatebonus.pending, (state) => {
                state.status = 'loading'; // Use 'status' for overall loading state
                state.error = null;
        })
        .addCase(updatebonus.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Find the updated bonus by ID and replace it in the array
            const index = state.bonuss.findIndex(bonus => bonus.id === action.payload.id);
            if (index !== -1) {
                state.bonuss[index] = action.payload; // Replace old bonus with updated one
            }
            state.error = null;
        })
        .addCase(updatebonus.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || action.error.message;
        });
    },
});

export default bonusSlice.reducer;
export const { clearbonusStatus } = bonusSlice.actions;
export const selectbonusStatus = (state) => state.bonus.status;
export const selectbonusError = (state) => state.bonus.error;
export const selectAllbonuss = (state) => state.bonus.bonuss;
