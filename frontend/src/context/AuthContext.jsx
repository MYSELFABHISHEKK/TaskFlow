import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext(null);

const getErrorMessage = (error, fallback) => {
  if (!error.response) return 'Backend API is not running. Start the server on port 5000.';
  return error.response.data?.message || fallback;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('taskflow_user') || 'null'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('taskflow_token')));

  useEffect(() => {
    const token = localStorage.getItem('taskflow_token');
    if (!token) return;
    api.get('/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem('taskflow_user', JSON.stringify(data.user));
      })
      .catch(() => logout(false))
      .finally(() => setLoading(false));
  }, []);

  const persist = (data) => {
    localStorage.setItem('taskflow_token', data.token);
    localStorage.setItem('taskflow_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (payload) => {
    try {
      const { data } = await api.post('/api/auth/login', payload);
      persist(data);
      toast.success('Welcome back');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Login failed'));
      throw error;
    }
  };

  const register = async (payload) => {
    try {
      const { data } = await api.post('/api/auth/register', payload);
      persist(data);
      toast.success('Workspace ready');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Registration failed'));
      throw error;
    }
  };

  const logout = (notify = true) => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setUser(null);
    if (notify) toast.success('Signed out');
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
