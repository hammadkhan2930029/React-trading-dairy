// src/pages/home/Redux/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios';
import TokenService from '../../../utils/tokenService'; // Ensure this path is correct

// Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await api.post('accounts/login/', { email, password });
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

// Register User
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (values, thunkAPI) => {
    try {
      if (values.password !== values.confirmPassword) {
        return thunkAPI.rejectWithValue('Passwords do not match.');
      }

      const response = await api.post('accounts/register/', {
        name: values.name,
        email: values.email,
        number: values.number,
        password: values.password,
      });

      console.log('Registration response:', response.data);
      return { message: response.data.message };

    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.response?.data || 'Registration failed');
    }
  }
);

// Activation of user account after registration (after clicking activation link)
export const activateUser = createAsyncThunk(
  'auth/activateUser',
  async ({ uidb64, token }, thunkAPI) => {
    try {
      const response = await api.get(`accounts/activate/${uidb64}/${token}/`);  // API request to activate the account
      
      if (response.status === 200) {
        const { user, access, refresh } = response.data;

        // Save tokens and user data to local storage using TokenService
        TokenService.saveAccessToken(access);
        TokenService.saveRefreshToken(refresh);
        TokenService.saveUserData(user);

        console.log('Account activated successfully! Tokens saved.');
        return { user, access, refresh }; // Return the user and token data to update the Redux store
      }

    } catch (err) {
      console.error('Account activation failed:', err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.response?.data || 'Account activation failed');
    }
  }
);



// Logout User
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
  try {
    await api.post('accounts/logout/'); // Assuming this blacklists the refresh token
    // Regardless of backend success, always clear frontend tokens immediately on logout request
    TokenService.logout(); // This calls TokenService.clearAuthStorage()
    console.log('Backend logout initiated and frontend tokens cleared.');
    return true;
  } catch (err) {
    // If backend logout fails, we still want to clear frontend tokens
    console.error('Backend logout failed, but clearing frontend tokens:', err.response?.data || err.message);
    TokenService.logout(); // Ensure frontend tokens are cleared even if backend call fails
    return thunkAPI.rejectWithValue(err.response?.data || 'Logout failed at backend');
  }
});

const initialState = {
  // Initialize state using TokenService for consistency
  user: TokenService.getUserData(),
  accessToken: TokenService.getAccessToken(),
  isAuthenticated: TokenService.isAuthenticated(), // Uses getAccessToken internally
  status: 'idle',
  error: null,
  message: null, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // This local logout reducer might be redundant if logoutUser thunk directly calls TokenService.logout()
    // and updates state via extraReducers. Keep for now if used elsewhere.
    logout: (state) => {
      TokenService.logout(); // Clear localStorage
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.status = 'idle'; // Reset status on local logout
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login reducers
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.access;
        state.isAuthenticated = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null; // Clear user data on failed login
        state.accessToken = null; // Clear access token on failed login
        state.isAuthenticated = false; // Set to false on failed login
      })

      // Register reducers (similar fixes)
     .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'registered';
        state.error = null;
        state.message = action.payload.message; // e.g. "Check your inbox"
        state.user = null;           // user is not logged in yet
        state.accessToken = null;    // no token yet
        state.isAuthenticated = false; // must activate + login first
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.message = null;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })

      // Account activation reducers
      .addCase(activateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(activateUser.fulfilled, (state, action) => {
        state.status = 'activated'; // Mark as successfully activated
        state.user = action.payload.user;
        state.accessToken = action.payload.access;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(activateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      // Logout reducers
      .addCase(logoutUser.fulfilled, (state) => {
        // TokenService.logout() is already called in the thunk's finally/try block
        state.user = null;
        state.accessToken = null;
        state.status = 'idle';
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Even if backend logout fails, we still want to log out on frontend
        // TokenService.logout() is called in the thunk's finally block
        state.user = null;
        state.accessToken = null;
        state.status = 'idle'; // Or 'failed' depending on desired UX
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions; // Export local logout action
export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;