import axios from 'axios';
import TokenService from '../utils/tokenService';

const api = axios.create({
    // baseURL: 'http://localhost:8000/',
    // baseURL: 'https://trading.cogentproducts.co/api/',
    baseURL: 'https://api.tradingdiary.pk/',

    withCredentials: true,
});

const publicPaths = [
    '/accounts/login/',
    '/accounts/register/',
    '/adminpanel/view_footer/',
    '/adminpanel/header_settings/',
];

/* ===========================
   REFRESH QUEUE
=========================== */
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
api.interceptors.request.use(
    (config) => {
        const isPublic = publicPaths.some(path =>
            config.url?.includes(path)
        );

        if (!isPublic) {
            const token = TokenService.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    error => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        const isPublic = publicPaths.some(path =>
            originalRequest.url?.includes(path)
        );

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isPublic
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newAccessToken = await TokenService.refreshAuthToken();

                isRefreshing = false;
                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError);

                TokenService.logout();
                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;