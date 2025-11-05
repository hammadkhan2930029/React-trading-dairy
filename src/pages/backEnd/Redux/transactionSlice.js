// src/pages/home/Redux/auth/transactionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios';


// Create Transction
export const createTransactions = createAsyncThunk('transactions/createTransactions',async (values, { rejectWithValue }) => {
    try {
      const response = await api.post('transaction/transactions/', {
      user_id: Number(values.user_id),
      amount: Number(values.amount),
      date: values.date,
      fore: values.fore,       
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue(error.message || "Unknown error");
  }
  });


// Async Thunk to fetch ALL transactions for the authenticated user
export const fetchTransactions = createAsyncThunk('transactions/fetchTransactions',async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('transaction/transactions/');
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Fetching transactions failed');
    }
  }
);

// Fetch Transactions Report
export const fetchTransactionsReport = createAsyncThunk(
  'transactions/fetchTransactionsReport',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('transaction/investment-report/'); 
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Fetching transactions report failed');
    }
  }
);


// Async thunk to update trasnaction at backend
export const updateTransactions = createAsyncThunk('tranaction/updateTransaction', async ({ id, updatedData }, thunkAPI) => {
    try {
        const payloadToSend = {
            //user_id: Number(updatedData.user_id), 
            amount: Number(updatedData.amount),
            date: updatedData.date,
            fore: 'Investment',            
            };

        const response = await api.put(`transaction/transactions/${id}/`, payloadToSend);
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

// Async thunk to update dividend at backend
export const updateTransactions_withdrawal = createAsyncThunk('tranaction/withdrawalTransaction', async ({ id, updatedData }, thunkAPI) => {
    try {
        const payloadToSend = {
            //user_id: Number(updatedData.user_id), 
            amount: Number(updatedData.amount),
            date: updatedData.date,
            fore: 'Withdrawal',            
            };

        const response = await api.put(`transaction/transactions/${id}/`, payloadToSend);
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


const transactionSlice = createSlice({
  name: 'transactions', 
  initialState: {
    transactionsList: [], 
    status: 'idle', 
    error: null,
    updateInvestmentStatus: 'idle', 
    updateInvestmentError: null,
    updateWithdrawalStatus: 'idle', 
    updateWithdrawalError: null,
    report: {
      total_invested: 0,
      total_withdrawn: 0,
      net_investment: 0,
    },
    reportStatus: 'idle',
    reportError: null,
  },
  reducers: {
    clearTransactiondStatus: (state) => {
      state.status = 'idle';
      state.error = null;
        },    
  },
  extraReducers: (builder) => {
    builder
      // --- fetchTransactions lifecycle ---
      .addCase(fetchTransactions.pending, (state) => {
        state.fetchStatus = 'loading';
        state.fetchError = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.transactionsList = action.payload;
        state.fetchError = null;
        // Ensure data is sorted by date (newest first) as per your model's Meta ordering
        state.transactionsList.sort((a, b) => new Date(b.date) - new Date(a.date));
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.fetchError = action.payload || 'Failed to fetch transactions';
        state.transactionsList = []; // Clear list on failure, or keep previous data
      })

      // --- createTransaction lifecycle ---
      .addCase(createTransactions.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createTransactions.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.transactionsList.unshift(action.payload); // Add new transaction to the start
        state.transactionsList.sort((a, b) => new Date(b.date) - new Date(a.date)); // Re-sort
        state.createError = null;
      })
      .addCase(createTransactions.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload || 'Failed to create transaction';
      })
      // --- updateTransactions (Investment) lifecycle ---
      .addCase(updateTransactions.pending, (state) => {
        state.updateInvestmentStatus = 'loading'; // Use specific status
        state.updateInvestmentError = null;
      })
      .addCase(updateTransactions.fulfilled, (state, action) => {
        state.updateInvestmentStatus = 'succeeded'; // Use specific status
        state.updateInvestmentError = null;

        const updatedTransaction = action.payload;
        const index = state.transactionsList.findIndex(
          (transaction) => transaction.id === updatedTransaction.id
        );

        if (index !== -1) {
          state.transactionsList[index] = updatedTransaction;
          state.transactionsList.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else {
          console.warn('Updated Investment transaction not found in the state, consider re-fetching.');
        }
      })
      .addCase(updateTransactions.rejected, (state, action) => {
        state.updateInvestmentStatus = 'failed'; // Use specific status
        state.updateInvestmentError = action.payload || 'Failed to update Investment transaction'; // Specific error message
      })

      // --- updateTransactions_withdrawal (Withdrawal) lifecycle ---
      .addCase(updateTransactions_withdrawal.pending, (state) => {
        state.updateWithdrawalStatus = 'loading'; // Use specific status
        state.updateWithdrawalError = null;
      })
      .addCase(updateTransactions_withdrawal.fulfilled, (state, action) => {
        state.updateWithdrawalStatus = 'succeeded'; // Use specific status
        state.updateWithdrawalError = null;

        const updatedTransaction = action.payload;
        const index = state.transactionsList.findIndex(
          (transaction) => transaction.id === updatedTransaction.id
        );

        if (index !== -1) {
          state.transactionsList[index] = updatedTransaction;
          state.transactionsList.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else {
          console.warn('Updated Withdrawal transaction not found in the state, consider re-fetching.');
        }
      })
      .addCase(updateTransactions_withdrawal.rejected, (state, action) => {
        state.updateWithdrawalStatus = 'failed'; // Use specific status
        state.updateWithdrawalError = action.payload || 'Failed to update Withdrawal transaction'; // Specific error message
      })
      .addCase(fetchTransactionsReport.pending, (state) => {
        state.reportStatus = 'loading';
        state.reportError = null;
      })
      .addCase(fetchTransactionsReport.fulfilled, (state, action) => {
        state.reportStatus = 'succeeded';
        state.report = action.payload;
      })
      .addCase(fetchTransactionsReport.rejected, (state, action) => {
        state.reportStatus = 'failed';
        state.reportError = action.payload || 'Failed to fetch transactions report';
      });


  },
});

export default transactionSlice.reducer;
export const selectAllTransaction = (state) => state.transactions.transactionsList;
export const selectTransactionsReport = (state) => state.transactions.report;
