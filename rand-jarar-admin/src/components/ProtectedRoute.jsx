import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authApi from '../../api/authApi';
import './ProtectedRoute.scss';

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 * 
 * @param {Object} props - Component props
 * @param {React.Component} props.children - Child components to render if authenticated
 * @param {boolean} props.requireAdmin - Whether route requires admin role (default: false)
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Quick check - localStorage
      const hasToken = authApi.isAuthenticated();
      
      if (!hasToken) {
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }

      // Verify token with API
      try {
        const response = await authApi.me();
        
        if (response.success) {
          setIsAuthenticated(true);
          setIsAdmin(response.data.role === 'admin');
        } else {
          // Token invalid - clear auth data
          authApi.clearAuthData();
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        authApi.clearAuthData();
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but not admin (and admin is required)
  if (requireAdmin && !isAdmin) {
    return (
      <div className="unauthorized-page">
        <div className="unauthorized-content">
          <div className="unauthorized-icon">🚫</div>
          <h1>غير مصرح</h1>
          <p>ليس لديك صلاحية الوصول إلى هذه الصفحة</p>
          <p className="unauthorized-hint">
            هذه الصفحة مخصصة للمسؤولين فقط
          </p>
          <button 
            className="back-btn"
            onClick={() => {
              authApi.logout();
              window.location.href = '/login';
            }}
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  // Authenticated and authorized - render children
  return children;
};

export default ProtectedRoute;