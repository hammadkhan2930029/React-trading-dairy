import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formType: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLogin: (state) => {
      state.formType = 1;
    },
    setRegister: (state) => {
      state.formType = 2;
    },
    setForget: (state) => {
      state.formType = 3;
    },
   
  },
});

export const { setForget,setLogin,setRegister } = loginSlice.actions;
export default loginSlice.reducer;
