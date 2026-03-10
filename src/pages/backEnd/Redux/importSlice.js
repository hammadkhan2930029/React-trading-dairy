import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../../api/axios"; 


// Async thunk to create a imports in DB at backend
export const createimports = createAsyncThunk('imports/create', async (values, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append("broker", Number(values.broker));
        formData.append('import_file', values.import_file);

        const response = await api.post('userimports/imports/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message || "Unknown error");
    }
});

// Async thunk to fetch imports from backend
export const fetchimports = createAsyncThunk('fetch/fetchimports', async (_, thunkAPI) => {
  try {
      const response = await api.get('userimports/imports/');
      return response.data; // This data will be the array of all imports
  } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Fetching imports failed');
  }
});

// Async thunk to update imports at backend
export const updateimports = createAsyncThunk('imports/updateimports', async ({ id, updatedData }, thunkAPI) => {
    try {
        const payloadToSend = {
            broker: Number(updatedData.broker_id), 
            import_file: updatedData.import_file,
        };

        const response = await api.put(`userimports/imports/${id}/`, payloadToSend);
        
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            
            return thunkAPI.rejectWithValue(error.response.data);
        } else {
            
            return thunkAPI.rejectWithValue(error.message);
        }
    }
});

// Async thunk to delete an import from backend
export const deleteimports = createAsyncThunk('imports/delete',async (id, { rejectWithValue }) => {
    try {
        await api.delete(`userimports/imports/${id}/`);
        return id; // return the deleted id to update the state
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message || "Unknown error");
        }
    }
);


const importSlice = createSlice({
    name: 'imports',
    initialState: {
        imports: [], 
        status: 'idle', 
        error: null,
    },
    reducers: {
        clearimportstatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
      builder
         .addCase(createimports.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(createimports.fulfilled, (state, action) => {
            state.status = 'succeeded';

            const exists = state.imports.find(
                imp => imp.id === action.payload.id
            );

            if (!exists) {
                state.imports.unshift(action.payload); // add once, at top
            }

            state.error = null;
        })
          .addCase(createimports.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload || action.error.message;
          })
         
          .addCase(fetchimports.pending, (state) => {
              state.status = 'loading';
              state.error = null; 
          })
          .addCase(fetchimports.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.imports = action.payload; 
              state.error = null;
          })
          .addCase(fetchimports.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload || action.error.message;
          })
        .addCase(updateimports.pending, (state) => {
                state.status = 'loading'; // Use 'status' for overall loading state
                state.error = null;
        })
        .addCase(updateimports.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Find the updated imports by ID and replace it in the array
            const index = state.imports.findIndex(imports => imports.id === action.payload.id);
            if (index !== -1) {
                state.imports[index] = action.payload; // Replace old imports with updated one
            }
            state.error = null;
        })
        .addCase(updateimports.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || action.error.message;
        })
        .addCase(deleteimports.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(deleteimports.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Remove deleted import from state
            state.imports = state.imports.filter(imp => imp.id !== action.payload);
            state.error = null;
        })
        .addCase(deleteimports.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || action.error.message;
        });
    },
});

export default importSlice.reducer;
export const { clearimportStatus } = importSlice.actions;
export const selectimportStatus = (state) => state.userImports.status;
export const selectimportError = (state) => state.userImports.error;
export const selectAllimports = (state) => state.userImports.imports;
