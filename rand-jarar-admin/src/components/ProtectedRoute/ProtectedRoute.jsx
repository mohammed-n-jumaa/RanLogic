import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageLoader from '../PageLoader/PageLoader';
import './ProtectedRoute.scss';
import { t } from '../../i18n';

/**
 * ProtectedRoute Component
 * Protects routes that require authentication.
 * The token is verified once by AuthProvider (/auth/me), not on every navigation.
 *
 * @param {React.ReactNode} props.children - Content to render when authorized
 * @param {boolean} props.requireAdmin - Whether route requires admin role (default: false)
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { status, isAdmin, logout } = useAuth();

  if (status === 'checking') {
    return <PageLoader fullScreen />;
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="unauthorized-page">
        <div className="unauthorized-content">
          <div className="unauthorized-icon">🚫</div>
          <h1>{t('غير مصرح')}</h1>
          <p>{t('ليس لديك صلاحية الوصول إلى هذه الصفحة')}</p>
          <p className="unauthorized-hint">
            {t('هذه الصفحة مخصصة للمسؤولين فقط')}
          </p>
          <button
            className="back-btn"
            onClick={async () => {
              await logout();
              navigate('/login', { replace: true });
            }}
          >
            {t('تسجيل الخروج')}
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
