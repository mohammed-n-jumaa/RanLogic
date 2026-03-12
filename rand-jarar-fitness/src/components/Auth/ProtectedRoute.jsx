import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authApi from '../../api/authApi';
import { useLanguage } from '../../contexts/LanguageContext';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);

  const location = useLocation();
  const { isArabic } = useLanguage();

  const didRefreshRef = useRef(false);

  useEffect(() => {
    checkAuth();
  
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = authApi.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (!authenticated) {
        setHasSubscription(false);
        return;
      }

      let user = authApi.getUser();
      let subscribed = user?.has_active_subscription === true;

      if (!subscribed && !didRefreshRef.current) {
        didRefreshRef.current = true;

        const refreshed = await authApi.refreshUser(); 

        if (refreshed?.success && refreshed?.data) {
          user = refreshed.data;
          subscribed = user?.has_active_subscription === true;
        }
      }

      setHasSubscription(subscribed);
    } catch (error) {
      console.error('Auth check error:', error);
      setHasSubscription(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{isArabic ? 'جاري التحقق...' : 'Checking authentication...'}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!hasSubscription && location.pathname === '/profile') {
    return <Navigate to="/plans" replace />;
  }

  return children;
};

export default ProtectedRoute;
