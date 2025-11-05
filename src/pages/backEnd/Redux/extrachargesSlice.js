// src/Redux/extrachargesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/axios"; // Your custom Axios instance

// Async thunk to fetch extra charges
export const fetchExtraCharges = createAsyncThunk(
    'extraCharges/fetchExtraCharges',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('broker/extracharges/');
            console.log('API Response (fetchExtraCharges):', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching extra charges:', error.response?.data || error.message);
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
            console.log('API Response (addExtraCharge):', response.data);
            return response.data;
        } catch (err) {
            console.error('Error in addExtraCharge thunk:', err.response?.data || err.message);
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
            console.log('Update Extra Charge response:', response.data);
            return response.data; // Return the updated extra charge data
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Update Extra Charge failed with API errors:', error.response.data);
                return thunkAPI.rejectWithValue(error.response.data);
            } else {
                console.error('Update Extra Charge failed:', error.message);
                return thunkAPI.rejectWithValue(error.message);
            }
        }
    }
);

// --- Combined Slice Definition ---

const extrachargesSlice = createSlice({
    name: 'extraCharges',
    initialState: {
        chargesList: [],
        loading: 'idle',
        formType: null,
        error: null,
    },
    reducers: {
        setOneTime: (state) => {
            state.formType = 7;
        },
        setmonthly: (state) => {
            state.formType = 77;
        },
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
            });
    },
});

// Corrected export for regular reducer actions
export const { setOneTime, setmonthly, setChargesList, clearExtraChargeFormType } = extrachargesSlice.actions;
export default extrachargesSlice.reducer;