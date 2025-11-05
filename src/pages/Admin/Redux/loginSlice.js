import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios';
import TokenService from '../../../utils/tokenService'
const initialState = {
  formType: null,
};

export const loginAdmin = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await api.post('login/', { email, password });
      // --- FIX START ---
      // Destructure 'refresh' token along with 'user' and 'access'
      const { user, access, refresh } = response.data;

      // Save both access and refresh tokens using TokenService
      TokenService.saveAccessToken(access);
      TokenService.saveRefreshToken(refresh); // <--- THIS IS THE MISSING PIECE!
      TokenService.saveUserData(user); // Use TokenService for user data consistency
      // --- FIX END ---

      console.log('Login successful! Tokens and user data saved.'); // Add log for confirmation
      return { user, access, refresh }; // Return refresh if your Redux state needs it, though not strictly necessary here
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message); // More detailed error log
      TokenService.clearAuthStorage(); // Clear any partial/bad data on login failure
      return thunkAPI.rejectWithValue(err.response?.data || 'Login failed');
    }
  }
);

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
