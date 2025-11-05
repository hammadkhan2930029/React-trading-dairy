import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formType: null, // Null means koi form select nahi hua abhi
};

const tradingJournalSlice = createSlice({
  name: "tradingJournal",
  initialState,
  reducers: {
     setJournal_from: (state) => {
      state.formType = 5; 
    },
    setTradingJournal_from: (state) => {
      state.formType = 6; 
    },
    setTradingJournal_View: (state) => {
      state.formType = 7; 
    },
     setTradingJournal_EditForm: (state) => {
      state.formType = 8; 
    },
  
    reset: (state) => {
      state.formType = null;
    },

  },
});

export const { setTradingJournal_View,setTradingJournal_from ,reset,setTradingJournal_EditForm ,setJournal_from} = tradingJournalSlice.actions;
export default tradingJournalSlice.reducer;