// src/utils/tokenService.js

// --- Dependencies ---
// Import your pre-configured Axios instance.
// This is crucial for refreshAuthToken to use your baseURL and other Axios settings.
import api from '../api/axios';

// OPTIONAL: If you manage authentication state in Redux,
// you might want to import your store and a logout action.
// This allows tokenService to dispatch Redux actions directly on auth events.
// Make sure to adjust the path to your actual Redux store and auth slice.
// import { store } from '../app/store'; // Example path to your Redux store
// import { userLoggedOut } from '../features/auth/authSlice'; // Example logout action creator


// --- Constants for Local Storage Keys ---
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user'; // Key for storing user profile data (e.g., username, ID)

// --- API Endpoints ---
const REFRESH_URL = 'accounts/refresh/'; // Standard DRF Simple JWT refresh endpoint


// --- Token Storage & Retrieval Utilities ---
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const saveAccessToken = (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token);
export const removeAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const saveRefreshToken = (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token);
export const removeRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_KEY);

export const getUserData = () => {
    try {
        const userData = localStorage.getItem(USER_DATA_KEY);
        return userData ? JSON.parse(userData) : null;
    } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        return null;
    }
};
export const saveUserData = (userData) => localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
export const removeUserData = () => localStorage.removeItem(USER_DATA_KEY);


// --- Authentication Status Check ---
export const isAuthenticated = () => Boolean(getAccessToken());


// --- Request Header Utility ---
// Attaches the access token to the Authorization header for Axios requests.
export const attachTokenToHeaders = (config) => {
    const token = getAccessToken();
    if (token) {
        // Use object spread for immutability, though direct assignment like config.headers.Authorization = ... is also common.
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
};


// --- Token Refresh Logic ---
// Attempts to refresh the access token using the stored refresh token.
export const refreshAuthToken = async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        // If no refresh token exists, clear all auth data and throw an error.
        console.warn('Refresh failed: No refresh token found. User needs to re-login.');
        clearAuthStorage();
        throw new Error('No refresh token available. Please log in again.');
    }

    try {
        // Make the POST request to the refresh endpoint using the Axios 'api' instance.
        const response = await api.post(REFRESH_URL, { refresh: refreshToken });

        // Destructure the response data to get new access and refresh tokens.
        const { access, refresh } = response.data;

        if (!access) {
            // If the backend didn't return an access token, it's an issue.
            throw new Error('Refresh endpoint did not return a new access token.');
        }

        // Save the newly received access token.
        saveAccessToken(access);

        // If the backend also sent a new refresh token, save it (common security practice).
        if (refresh) {
            saveRefreshToken(refresh);
        }

        console.log('Access token refreshed successfully.');
        return access; // Return the new access token.

    } catch (error) {
        // Log the detailed error from the API response or a generic message.
        console.error(
            'Token refresh failed:',
            error.response?.data || error.message || 'Unknown refresh error'
        );

        // Clear all authentication data on refresh failure to force re-login.
        clearAuthStorage();

        // OPTIONAL: Dispatch a Redux logout action here if you manage auth state globally.
        // if (store && userLoggedOut) {
        //     store.dispatch(userLoggedOut());
        // }

        // Throw a specific error message based on the backend response or a generic one.
        const errorMessage = error.response?.data?.detail || 'Session expired. Please log in again.';
        throw new Error(errorMessage);
    }
};


// --- Logout Utility ---
// Clears all authentication-related data and performs any necessary cleanup.
export const logout = () => {
    console.log('Logging out: Clearing authentication storage.');
    clearAuthStorage();
    // OPTIONAL: Dispatch a Redux logout action if not handled by clearAuthStorage's internal dispatch.
    // if (store && userLoggedOut) {
    //     store.dispatch(userLoggedOut());
    // }
};


// --- Clear All Authentication Data ---
// A centralized function to remove all auth-related items from localStorage.
export const clearAuthStorage = () => {
    removeAccessToken();
    removeRefreshToken();
    removeUserData(); // Clear user data as well
    console.log('All authentication storage cleared.');
};


// --- Central Token Service Export ---
// Export a single object containing all utility functions for easy import.
const TokenService = {
    getAccessToken,
    saveAccessToken,
    removeAccessToken,
    getRefreshToken,
    saveRefreshToken,
    removeRefreshToken,
    getUserData,
    saveUserData,
    removeUserData,
    isAuthenticated,
    attachTokenToHeaders,
    refreshAuthToken,
    logout,
    clearAuthStorage,
};

export default TokenService;