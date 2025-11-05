// src/pages/home/Redux/stockSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios"; 

// Async thunk to update stocks at backend
export const updateTrade = createAsyncThunk('trades/updateTrade', async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await api.put(`stocks/trades/${id}/`, updatedData);
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

  }
);



// Async thunk to fetch stocks from backend
export const fetchStocks = createAsyncThunk('fetch/fetchStocks', async (_, thunkAPI) => {
  try {
    const response = await api.get('stocks/stocks/');
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || 'Fetching stocks failed');
  }
});



// Async thunk to create trade_buy in DB at backend
export const createTrade = createAsyncThunk('create/createTrade',async (values, thunkAPI) => {
    try {
      const response = await api.post('stocks/trades/', {
      user_id:                Number(values.user_id),
      trade_type :            values.trade_type,
      trade_date :            values.trade_date,      
      settlement_date :       values.sett_date || null,
      quantity   :            Number(values.buy_QTY),
      rate :                  Number(values.buy_rate), 
      amount :                Number(values.buy_amount), 
      broker_commission :     Number(values.buy_broker_amount) || 0,
      cdc_amount :            Number(values.buy_cdc_amount) || 0,
      sst_amount :            Number(values.buy_sst_amount) || 0,
      net_amount :            Number(values.buy_net_amount), 
      avg_buying :            Number(values.avg_buying),
      created_at :            values.trade_date,
      broker_id  :            Number(values.broker_id), 
      stock_id :              Number(values.stock_id)
        
      });
      console.log(response.data)
      return response.data; // Should be the list of stocks or a stock item
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'creating Trade failed');
    }
  });
// Async thunk to create trade_sell in DB at backend
export const createTrade_sell = createAsyncThunk('create/createTrade',async (values, thunkAPI) => {
    try {
      const response = await api.post('stocks/trades/', {
      user_id:                Number(values.user_id,),               
      trade_type :            values.trade_type,
      trade_date :            values.trade_date,      
      settlement_date :       values.sett_date || null,
      quantity   :            Number(values.sell_QTY),
      rate :                  Number(values.sell_rate), 
      amount :                Number(values.sell_amount), 
      broker_commission :     Number(values.sell_broker_amount) || 0,
      cdc_amount :            Number(values.sell_cdc_amount) || 0,
      sst_amount :            Number(values.sell_sst_amount) || 0,
      net_amount :            Number(values.net_amount), 
      avg_buying :            Number(values.avg_buying),
      created_at :            values.trade_date,
      broker_id  :            Number(values.broker_id), 
      stock_id :              Number(values.stock_id)           
      });
      console.log(response.data)
      return response.data; // Should be the list of stocks or a stock item
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'creating Trade failed');
    }
  });

// Async thunk to fetch trade from  DB at backend
export const fetchTrades = createAsyncThunk('trades/fetchTrades', async (_, thunkAPI) => {
   try {
    const response = await api.get('stocks/trades/');
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || 'Fetching stocks failed');
  }
});
 
const stockSlice = createSlice({
  name: "stocks",
  initialState: {
    stocks: [],
    trades: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = 'fullfilled';
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = 'fail';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchTrades.pending, (state) => {
      state.loading = 'pending';
      state.error = null;
      })
      .addCase(fetchTrades.fulfilled, (state, action) => {
        state.loading = 'fullfilled';
        state.trades = action.payload;
      })
      .addCase(fetchTrades.rejected, (state, action) => {
        state.loading = 'fail';
        state.error = action.payload || action.error.message;
      })
      .addCase(updateTrade.fulfilled, (state, action) => {
      const index = state.trades.findIndex(trade => trade.id === action.payload.id);
      if (index !== -1) {
        state.trades[index] = action.payload; // replace old trade with updated one
                        }
      state.loading = 'fullfilled';
      })
      .addCase(updateTrade.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(updateTrade.rejected, (state, action) => {
        state.loading = 'fail';
        state.error = action.payload || action.error.message;
      });


  },
});

// Selectors
export const selectAllStocks = (state) => state.stocks.stocks;
export const selectStockLoading = (state) => state.stocks.loading;
export const selectStockError = (state) => state.stocks.error;
export const selectAllTrades = (state) => state.trades.trades;

export default stockSlice.reducer;