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
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data.user);
          if (res.data.user.role === 'admin') {
            setAdmin(res.data.user);
          }
        } catch (error) {
          console.error("Token verification failed", error);
          localStorage.removeItem('token');
          setUser(null);
          setAdmin(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
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
      setAdmin(res.data.user);
      setUser(res.data.user); // Set user state too so Checkout/Cart work
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const adminSignup = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/admin/signup', { name, email, password });
      localStorage.setItem('token', res.data.token);
      setAdmin(res.data.user);
      setUser(res.data.user);
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
      setAdmin(res.data.user);
      setUser(res.data.user);
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

