import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formType: null,
};

const extraChargesSlice = createSlice({
  name: "extraCharges",
  initialState,
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
});

export const { setOneTime,setChargesList,setmonthly } = extraChargesSlice.actions;
export default extraChargesSlice.reducer;
