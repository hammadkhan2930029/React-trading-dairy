import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios'; 
// Base API URL
const BASE_URL = 'rules/rules/';

// Thunks
export const fetchRules = createAsyncThunk('rules/fetchRules',  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(BASE_URL);
      console.log('rules fetched successfully:', response.data); 
      return response.data;
    } catch (err) {
      console.error('rules fetched failed:', err.response?.data || err.message); 
      return rejectWithValue(err.response?.data || 'Fetching rules failed');
    }
  }
);



export const addRule = createAsyncThunk('rules/addRule', async (rule_text, { rejectWithValue }) => {
  try {
    const payload = { rule_text: rule_text };
    const response = await api.post(BASE_URL, payload); 
    console.log('Rule added successfully:', response.data);
    return response.data;
  } catch (err) {
    console.error('Adding rule failed:', err.response?.data || err.message);
    return rejectWithValue(err.response?.data || 'Adding rule failed');
  }
});


export const updateRule = createAsyncThunk('rules/updateRule',async ({ ruleId, rule_text }, { rejectWithValue }) => {
    try {
        const response = await api.put(`${BASE_URL}${ruleId}/`, { rule_text });
    console.log('Rule update successfully:', response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Update failed');
    }
  }
);

export const deleteRule = createAsyncThunk('rules/deleteRule',async (ruleId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${BASE_URL}${ruleId}/`);
      console.log('Rule deleted successfully:', response.data);
      return ruleId; 
    } catch (err) {
      console.error('Deleting rule failed:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data || 'Deleting rule failed');
    }
  }
);
// Initial state
const initialState = {
  rules: [],
  loading: false,
  error: null,
};

// Slice
const ruleSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch rules
      .addCase(fetchRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRules.fulfilled, (state, action) => {
        state.loading = false;
        //state.rules = action.payload;
        state.rules = Array.isArray(action.payload) ? action.payload : [];

      })
      .addCase(fetchRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add rule
      .addCase(addRule.fulfilled, (state, action) => {
        if (Array.isArray(state.rules)) {
            state.rules.push(action.payload);
               }
        else {
            state.rules = [action.payload];
        }

        //state.rules.push(action.payload);       
      })

      // Update rule
      .addCase(updateRule.fulfilled, (state, action) => {
        const index = state.rules.findIndex((rule) => rule.id === action.payload.id);
        if (index !== -1) {
          state.rules[index].rule_text = action.payload.rule_text;
        }
      })

      // Delete rule
      .addCase(deleteRule.fulfilled, (state, action) => {
        state.rules = state.rules.filter((rule) => rule.id !== action.payload);
        
       

      });
  },
});

export default ruleSlice.reducer;
