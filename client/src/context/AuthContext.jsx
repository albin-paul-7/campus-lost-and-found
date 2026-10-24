import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // Validate existing token on mount
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [logout]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await authService.login({ email, password });
      if (res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      const msg = err.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await authService.register(userData);
      if (res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: true, message: res.message };
    } catch (err) {
      const msg = err.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await authService.updateProfile(data);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
        return { success: true, message: res.message };
      }
      return { success: false, message: 'Update failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
