import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token');

    // Tokens will be validated on first API call
    // If invalid, they'll be removed by error handlers
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (name, email, mobile, password) => {
    try {
      const res = await axios.post('/api/auth/signup', { name, email, mobile, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/admin/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setAdmin(res.data.admin);
      setUser(res.data.admin); // Set user state too so Checkout/Cart work
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const adminSignup = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/admin/signup', { name, email, password });
      localStorage.setItem('token', res.data.token);
      setAdmin(res.data.admin);
      setUser(res.data.admin);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  const googleLoginUser = async (credential) => {
    try {
      const res = await axios.post('/api/auth/google/user', { idToken: credential });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Google Login failed' };
    }
  };

  const googleLoginAdmin = async (credential) => {
    try {
      const res = await axios.post('/api/auth/google/admin', { idToken: credential });
      localStorage.setItem('token', res.data.token);
      setAdmin(res.data.admin);
      setUser(res.data.admin);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Google Admin Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAdmin(null);
  };

  const value = {
    user,
    admin,
    login,
    signup,
    adminLogin,
    adminSignup,
    googleLoginUser,
    googleLoginAdmin,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

