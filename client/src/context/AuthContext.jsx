import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sidequest_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await API.get('/auth/me');
        setUser(data);
      } catch (error) {
        console.error('Session restore failed:', error);
        localStorage.removeItem('sidequest_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (emailOrUsername, password) => {
    const { data } = await API.post('/auth/login', { emailOrUsername, password });
    localStorage.setItem('sidequest_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (userData) => {
    const { data } = await API.post('/auth/signup', userData);
    localStorage.setItem('sidequest_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('sidequest_token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
