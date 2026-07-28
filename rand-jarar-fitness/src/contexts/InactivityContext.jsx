import { createContext, useContext, useEffect } from 'react';
import useInactivityTimeout from '../hooks/useInactivityTimeout';
import authApi from '../api/authApi';

const InactivityContext = createContext(null);

export const useInactivity = () => {
  const context = useContext(InactivityContext);
  if (!context) {
    throw new Error('useInactivity must be used within InactivityProvider');
  }
  return context;
};

export const InactivityProvider = ({ children, timeoutMinutes = 30, warningMinutes = 5 }) => {
  const { resetTimer, logout } = useInactivityTimeout(timeoutMinutes, warningMinutes);

  useEffect(() => {
    const isAuth = authApi.isAuthenticated();
    
    if (isAuth) {
      if (!authApi.isSessionValid(timeoutMinutes)) {
        console.log('Session expired due to inactivity');
        logout();
        return;
      }
      
      authApi.updateLastActivity();
    }
  }, [timeoutMinutes, logout]);

  useEffect(() => {
    const updateLastActivity = () => {
      if (authApi.isAuthenticated()) {
        authApi.updateLastActivity();
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      window.addEventListener(event, updateLastActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateLastActivity);
      });
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!authApi.isAuthenticated()) return;

      if (document.hidden) {
        authApi.updateLastActivity();
      } else {
        if (!authApi.isSessionValid(timeoutMinutes)) {
          logout();
        } else {
          resetTimer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timeoutMinutes, resetTimer, logout]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (authApi.isAuthenticated()) {
        authApi.updateLastActivity();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const value = {
    resetTimer,
    logout
  };

  return (
    <InactivityContext.Provider value={value}>
      {children}
    </InactivityContext.Provider>
  );
};