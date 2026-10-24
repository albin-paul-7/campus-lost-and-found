import axios from 'axios';

// Create configured axios instance
// Base URL reads from environment variable, falling back to local server
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor: attach JWT token if available in localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: normalize error messages
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected network error occurred'
    };
    return Promise.reject(customError);
  }
);

export default API;
