import axios from 'axios';
import { attachTokenToHeaders, refreshAuthToken, removeAccessToken } from '../utils/tokenService';

const api = axios.create({
// baseURL: 'http://localhost:8000/',
baseURL: 'https://trading.cogentproducts.co/api/',  // ✅ Live URL  
// baseURL: 'https://api.tradingdiary.pk/',



  withCredentials: true,
});

// --- Refresh Queue Logic ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {

  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// --- Request Interceptor ---
api.interceptors.request.use((config) => {
  const publicPaths = ['/accounts/login/', '/accounts/register/'];
  const isPublic = publicPaths.some(path => config.url?.startsWith(path));

  if (!isPublic) {
    return attachTokenToHeaders(config);
  } else {
    delete config.headers.Authorization;
    return config;
  }
}, (error) => Promise.reject(error));

// --- Response Interceptor ---
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    const isPublicPath = ['/accounts/login/', '/accounts/register/'].some(path => originalRequest.url?.startsWith(path));

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublicPath
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAuthToken();
        isRefreshing = false;
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        removeAccessToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;