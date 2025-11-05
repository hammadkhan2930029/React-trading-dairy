import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";


export const createProfile = createAsyncThunk(
    'profile/createProfile',
    async (values, { rejectWithValue }) => {
        try {
            
            const payload = {
                email: values.email,
                name: values.name, 
                number: values.number,
                type: values.type,
            };
            // Only include password fields if they are actually provided by the form
            if (values.password) { // Check if password exists (and thus confirmPassword should too by form validation)
                payload.password = values.password;
                payload.confirm_password = values.confirmPassword;
            }

            const response = await api.patch('accounts/profile/', payload); // Changed to PATCH
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Unknown error creating/updating profile");
        }
    }
);

// Async thunk to fetch profile from backend
export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile', // Consistent naming: sliceName/actionName
    async (_, thunkAPI) => {
        try {
            const response = await api.get('accounts/profile/');
            return response.data; // This data is expected to be a single profile object
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || 'Fetching profile failed');
        }
    }
);


const profileSlice = createSlice({
    name: "profile",
    initialState: {
        profileData: null, // Stores the single fetched profile object
        profileList: [],   // Currently unused, but kept if other endpoints return lists
        formType: null,    // Used for UI state management (which form to show)
        status: 'idle',    // Tracks async operation status: 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null, 
        updateStatus: 'idle',       
      
    },
    reducers: {
        setAdminProfile: (state) => {
            state.formType = 888;
        },
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
        },
        resetUpdateStatus: (state) => {
        state.updateStatus = 'idle';
        },
        setShowSuccessOnLoad: (state, action) => {
        state.showSuccessOnLoad = action.payload;
    }
    },
    extraReducers: (builder) => {
    builder
        //  Fetch profile cases
        .addCase(fetchProfile.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(fetchProfile.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.profileData = action.payload;
        })
        .addCase(fetchProfile.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
            state.profileData = null;
        })

        //  Create/Update profile cases
        .addCase(createProfile.pending, (state) => {
            state.updateStatus = 'loading';
            state.error = null;
        })
        .addCase(createProfile.fulfilled, (state, action) => {
            state.updateStatus = 'succeeded';
            state.profileData = action.payload;                    

        })
        .addCase(createProfile.rejected, (state, action) => {
            state.updateStatus = 'failed';
            state.error = action.payload;
            
        });
},

});

// Export actions created by createSlice
export const {
    setProfile,
    setEditeProfile,
    setDividen,
    setDividen_list,
    setBrokerForm,
    setBroker_list,
    resetProfile,
    setAdminProfile
} = profileSlice.actions;


export const selectProfileData = (state) => state.profile.profileData;
export const selectProfileList = (state) => state.profile.profileList;

export default profileSlice.reducer;
export const { resetUpdateStatus} = profileSlice.actions;


