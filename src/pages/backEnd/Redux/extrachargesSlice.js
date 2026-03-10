// src/Redux/extrachargesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/axios"; // Your custom Axios instance

// Async thunk to fetch extra charges
export const fetchExtraCharges = createAsyncThunk(
    'extraCharges/fetchExtraCharges',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('broker/extracharges/');
            
            return response.data;
        } catch (error) {
            
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk to save one time charges in ExtraCharges Table in DB at backend
export const addExtraCharge = createAsyncThunk(
    'extraCharges/addExtraCharge',
    async (payload, thunkAPI) => {
        try {
            const response = await api.post('broker/extracharges/', payload);
            return response.data;
        } catch (err) {
            
            return thunkAPI.rejectWithValue(err.response?.data || 'Failed to add extra charges');
        }
    }
);

// Async thunk to update an extra charge at the backend
export const updateExtraCharge = createAsyncThunk(
    'extraCharges/updateExtraCharge',
    async ({ id, updatedData }, thunkAPI) => { // Destructure id and updatedData
        try {
            const response = await api.put(`broker/extracharges/${id}/`, updatedData);
            return response.data; // Return the updated extra charge data
        } catch (error) {
            if (error.response && error.response.data) {
                return thunkAPI.rejectWithValue(error.response.data);
            } else {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
    }
);

// Async thunk to delete an import from backend
export const deleteExtraCharges = createAsyncThunk('extraCharges/delete',async (id, { rejectWithValue }) => {
    try {
        await api.delete(`broker/extracharges/${id}/`);
        return id; // return the deleted id to update the state
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message || "Unknown error");
        }
    }
);

// Async thunk to fetch extra charges
export const fetchChargesTypes = createAsyncThunk(
    'extraCharges/fetchChargesTypes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('broker/chargestypes/');
            
            return response.data;
        } catch (error) {
            
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// --- Combined Slice Definition ---

const extrachargesSlice = createSlice({
    name: 'extraCharges',
    initialState: {
        chargesList: [],
        chargesTypes: [],
        loadingCharges: 'idle',
        loadingTypes: 'idle',
        loadingAction: 'idle',
        error: null,
    },
    reducers: {
        setChargesList: (state) => {
            state.formType = 78;
        },
    },
    extraReducers: (builder) => {
        builder
            // Cases for fetchExtraCharges
            .addCase(fetchExtraCharges.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(fetchExtraCharges.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.chargesList = action.payload; // Store fetched data
            })
            .addCase(fetchExtraCharges.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
                state.chargesList = [];
            })
            // Cases for addExtraCharge
            .addCase(addExtraCharge.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(addExtraCharge.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.chargesList.unshift(action.payload);
            })
            .addCase(addExtraCharge.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
            })
            // Cases for updateExtraCharge
            .addCase(updateExtraCharge.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(updateExtraCharge.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                const updatedCharge = action.payload;
                const index = state.chargesList.findIndex(charge => charge.id === updatedCharge.id);
                if (index !== -1) {
                    state.chargesList[index] = updatedCharge; // Update the item in the local state
                }
            })
            .addCase(updateExtraCharge.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchChargesTypes.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(fetchChargesTypes.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.chargesTypes = action.payload; // Store fetched data
            })
            .addCase(fetchChargesTypes.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
                state.chargesTypes = [];
            })
            .addCase(deleteExtraCharges.pending, (state) => {
                state.loadingAction = 'pending';
                state.error = null;
            })
            .addCase(deleteExtraCharges.fulfilled, (state, action) => {
                state.loadingAction = 'succeeded';
                state.chargesList = state.chargesList.filter(
                    charge => charge.id !== action.payload
                );
            })
            .addCase(deleteExtraCharges.rejected, (state, action) => {
                state.loadingAction = 'failed';
                state.error = action.payload;
            });
    },
});

// Corrected export for regular reducer actions
export const { setChargesList } = extrachargesSlice.actions;
export default extrachargesSlice.reducer;
export const selectExtraCharges = (state) => state.extraCharges.chargesList;