import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formType: null, // Null means koi form select nahi hua abhi
};

const formTypeSlice = createSlice({
  name: "formType",
  initialState,
  reducers: {
    setBuyForm: (state) => {
      state.formType = 2; // Buy Form ke liye 2 save karna
    },
    setSellForm: (state) => {
      state.formType = 3; // Sell Form ke liye 1 save karna
    },
      setBuy_sell_list: (state) => {
      state.formType = 4; // Sell Form ke liye 1 save karna
    },
    setDashboardView: (state) => {
      state.formType = 1; // DashboardView ke liye 1 save karna
    },
    holding_details: (state) => {
      state.formType = 99; // holding details ke liye 99 save karna
    },
    close_Trades: (state) => {
      state.formType = 111; // Sell Form ke liye 1 save karna
    },
    reset: (state) => {
      state.formType = null; // Dynamic form type set karne ke liye
    },
    DividenList: (state) => {
      state.formType = 18; // Dividend form type
    },
    setBackToSummary: (state) => {
      state.formType  = 12;
    },
    setTotalInvestment: (state) => {
        state.formType = 20;
   },
    setMarketSummaryDetails: (state) => {
        state.formType = 14;
    },
   
    
  },
});

export const { setDashboardView,setBuyForm, setSellForm ,setBuy_sell_list,holding_details,close_Trades,reset,DividenList,setTotalInvestment,setBackToSummary,setMarketSummaryDetails} = formTypeSlice.actions;
export default formTypeSlice.reducer;
