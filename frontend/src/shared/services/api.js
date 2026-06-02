import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Request interceptor to add JWT token to Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gastrocontrol:auth:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh');
      const token = localStorage.getItem('gastrocontrol:auth:token');

      // Only clear auth and redirect when the user already had a token or when the request was not login/refresh
      if (token || !isAuthRequest) {
        localStorage.removeItem('gastrocontrol:auth:token');
        localStorage.removeItem('gastrocontrol:auth:refreshToken');
        localStorage.removeItem('gastrocontrol:auth:user');

        if (typeof window !== 'undefined' && !isAuthRequest) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
export default api;
