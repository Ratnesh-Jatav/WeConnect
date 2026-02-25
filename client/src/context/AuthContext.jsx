import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

const normalizeUser = (userData) => {
  if (!userData) return null;
  return {
    ...userData,
    id: userData.id || userData._id,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return normalizeUser(JSON.parse(localStorage.getItem('user')));
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [sessionType, setSessionType] = useState(localStorage.getItem('sessionType') || null);
  const [loading, setLoading] = useState(true);

  const login = useCallback((userData, authToken, type) => {
    const normalizedUser = normalizeUser(userData);
    const resolvedSessionType = type || (normalizedUser?.role === 'admin' ? 'admin' : 'user');

    setUser(normalizedUser);
    setToken(authToken);
    setSessionType(resolvedSessionType);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('sessionType', resolvedSessionType);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setSessionType(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionType');
  }, []);

  const updateUser = useCallback((updater) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = normalizeUser(typeof updater === 'function' ? updater(prev) : { ...prev, ...updater });
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (!isMounted) return;

        const freshUser = normalizeUser(response.data.user);
        const nextSessionType = freshUser?.role === 'admin' ? 'admin' : 'user';

        setUser(freshUser);
        setSessionType(nextSessionType);
        localStorage.setItem('user', JSON.stringify(freshUser));
        localStorage.setItem('sessionType', nextSessionType);
      } catch (error) {
        if (isMounted) logout();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';
  const isUserSession = isAuthenticated && !isAdmin && sessionType === 'user';

  return (
    <AuthContext.Provider value={{ user, token, loading, setLoading, login, logout, updateUser, isAuthenticated, isAdmin, isUserSession, sessionType }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
