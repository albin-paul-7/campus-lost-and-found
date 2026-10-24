import API from './api';

export const authService = {
  // Register a new account
  register: async (userData) => {
    const res = await API.post('/auth/register', userData);
    return res.data;
  },

  // Login with email and password
  login: async (credentials) => {
    const res = await API.post('/auth/login', credentials);
    return res.data;
  },

  // Get current logged-in user profile
  getMe: async () => {
    const res = await API.get('/auth/me');
    return res.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const res = await API.put('/auth/profile', data);
    return res.data;
  }
};
