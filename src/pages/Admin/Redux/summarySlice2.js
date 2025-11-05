import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formType: null,
};

const summary2Slice = createSlice({
  name: "summary2",
  initialState,
  reducers: {
    setMarketSummaryDetails: (state) => {
      state.formType = 14;
    },
    setBackToSummary: (state) => {
      state.formType = 12;
    },
    resetSummary2: (state) => {
      state.formType = null;
    },
   
   
  },
});

export const { setMarketSummaryDetails,resetSummary2,setBackToSummary } = summary2Slice.actions;
export default summary2Slice.reducer;
