import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import authApi from '../api/authApi';
import { disconnectEcho } from '../lib/socket';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider
 * Verifies the stored token once with /auth/me and shares the user app-wide,
 * so pages and route guards don't each hit the API on every navigation.
 *
 * status: 'checking' | 'authenticated' | 'guest'
 */
export const AuthProvider = ({ children }) => {
  const hasToken = authApi.isAuthenticated();
  const [user, setUser] = useState(() => (hasToken ? authApi.getUser() : null));
  const [status, setStatus] = useState(hasToken ? 'checking' : 'guest');

  const clearSession = useCallback(() => {
    authApi.clearAuthData();
    // Close the realtime socket (if the chat opened it) so it doesn't outlive the session
    disconnectEcho();
    setUser(null);
    setStatus('guest');
  }, []);

  const refreshUser = useCallback(async () => {
    if (!authApi.isAuthenticated()) {
      setUser(null);
      setStatus('guest');
      return null;
    }

    const response = await authApi.me();

    if (response.success) {
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      setStatus('authenticated');
      return response.data;
    }

    // Token rejected by the server
    if (response.status === 401 || response.status === 403) {
      clearSession();
      return null;
    }

    // Network/server hiccup: keep the stored session instead of logging out
    const storedUser = authApi.getUser();
    if (storedUser) {
      setUser(storedUser);
      setStatus('authenticated');
      return storedUser;
    }

    clearSession();
    return null;
  }, [clearSession]);

  useEffect(() => {
    if (hasToken) refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authApi.login(email, password);
    if (response.success && response.data?.user) {
      setUser(response.data.user);
      setStatus('authenticated');
    }
    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(() => ({
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isAdmin: status === 'authenticated' && user?.role === 'admin',
    login,
    logout,
    clearSession,
    refreshUser,
  }), [user, status, login, logout, clearSession, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
