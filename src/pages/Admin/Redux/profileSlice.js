import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formType: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state) => {
      state.formType = 8;
    },
    setEditeProfile: (state) => {
      state.formType = 9;
    },
    setDividen: (state) => {
      state.formType = 17;
    },
    setDividen_list: (state) => {
      state.formType = 18;
    },
    setBroker_list: (state) => {
      state.formType = 5;
    },
    setBrokerForm: (state) => {
      state.formType = 55;
    },
    resetProfile: (state) => {
      state.formType = null;
    }

  },
});

export const { setProfile, setEditeProfile, setDividen, setDividen_list, setBrokerForm, setBroker_list,resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
