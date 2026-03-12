import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, 
  FaSignOutAlt, 
  FaCrown,
  FaSpinner,
  FaTimes
} from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext'; // ✅ مثل MealCard
import authApi from '../../../api/authApi';
import logoApi from '../../../api/logoApi';
import './ProfileSidebar.scss';

const ProfileSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [logoLoading, setLogoLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  const { t, currentLang } = useProfileLanguage(); // ✅ t(ar,en) + currentLang
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const getDefaultAvatar = (user) => {
    if (!user) return 'https://i.postimg.cc/WpqHf2CH/download.png';
    
    const defaultAvatarUrls = [
      'https://i.postimg.cc/WpqHf2CH/download.png',
      'http://localhost:8000/images/default-avatar-female.png',
      'http://localhost:8000/images/default-avatar-male.png',
      '/images/default-avatar-female.png',
      '/images/default-avatar-male.png',
      '',
      null
    ];
    
    const hasCustomAvatar = user.avatar_url && 
                           !defaultAvatarUrls.includes(user.avatar_url) &&
                           !user.avatar_url.includes('default-avatar');
    
    if (hasCustomAvatar) {
      return user.avatar_url;
    }

    if (user.gender === 'male') {
      return 'https://i.postimg.cc/VNmvRfK2/0b90cfaf-8167-4730-8de0-8872054ff0c5.jpg';
    } else if (user.gender === 'female') {
      return 'https://i.postimg.cc/bvmy9QDq/fee021a6-b60e-4456-abc4-6febcb2353c4.jpg';
    }
    
    return 'https://i.postimg.cc/WpqHf2CH/download.png';
  };

  useEffect(() => {
    fetchActiveLogo();
    fetchCurrentUser();
  }, []);

  const fetchActiveLogo = async () => {
    try {
      setLogoLoading(true);
      const response = await logoApi.getActiveLogo();
      if (response.success && response.data) {
        setLogoData(response.data);
      }
    } catch (err) {
      console.error('Error fetching logo:', err);
    } finally {
      setLogoLoading(false);
    }
  };

  const fetchCurrentUser = () => {
    const currentUser = authApi.getUser();
    setUser(currentUser);
    setUserLoading(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setSidebarOpen(false);
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMenuItemClick = () => {
    setSidebarOpen(false);
  };

  if (userLoading) {
    return (
      <div className="floating-button loading" aria-label={t('جاري التحميل...', 'Loading...')}>
        <FaSpinner className="spinner" />
      </div>
    );
  }

  return (
    <>
      {/* Floating Avatar Button */}
      <motion.button
        className="floating-avatar-button"
        onClick={() => setSidebarOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        aria-label={t('فتح القائمة', 'Open menu')}
      >
        <img 
          src={getDefaultAvatar(user)} 
          alt={user?.name || t('مستخدم', 'User')} 
          className="avatar-image"
          onError={(e) => {
            e.target.src = 'https://i.postimg.cc/WpqHf2CH/download.png';
          }}
        />
        
        {user?.has_active_subscription && (
          <span className="premium-badge" title={t('مشترك مميز', 'Premium Member')}>
            <FaCrown />
          </span>
        )}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            ref={sidebarRef}
            className="profile-sidebar-panel"
            initial={{ x: currentLang === 'ar' ? 300 : -300 }}
            animate={{ x: 0 }}
            exit={{ x: currentLang === 'ar' ? 300 : -300 }}
            transition={{ type: "spring", damping: 25 }}
          >
            {/* Close Button */}
            <button 
              className="sidebar-close"
              onClick={() => setSidebarOpen(false)}
              aria-label={t('إغلاق', 'Close')}
              title={t('إغلاق', 'Close')}
            >
              <FaTimes />
            </button>

            {/* Logo */}
            <Link to="/" className="sidebar-logo" onClick={handleMenuItemClick}>
              <motion.div 
                className="logo-container"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {logoLoading ? (
                  <div className="logo-loading">
                    <FaSpinner className="spinner" />
                  </div>
                ) : logoData ? (
                  <img 
                    src={logoData.file_url} 
                    alt={t('الشعار', 'Logo')} 
                    className="logo-image" 
                  />
                ) : (
                  <div className="logo-placeholder">
                    <span>{t('RanLogic', 'RanLogic')}</span>
                  </div>
                )}
              </motion.div>
            </Link>

            {/* User Info */}
            <div className="sidebar-user-info">
              <div className="user-avatar-large">
                <img 
                  src={getDefaultAvatar(user)} 
                  alt={user?.name || t('مستخدم', 'User')} 
                  className="avatar-image"
                  onError={(e) => {
                    e.target.src = 'https://i.postimg.cc/WpqHf2CH/download.png';
                  }}
                />
                
                {user?.has_active_subscription && (
                  <span className="premium-badge-large" title={t('مشترك مميز', 'Premium Member')}>
                    <FaCrown />
                  </span>
                )}
              </div>

              <h3 className="user-name">{user?.name || t('مستخدم', 'User')}</h3>
              
              {user?.has_active_subscription && (
                <span className="premium-text">
                  <FaCrown /> {t('مشترك مميز', 'Premium Member')}
                </span>
              )}
            </div>

            <div className="sidebar-divider"></div>

            {/* Menu Items */}
            <div className="sidebar-menu">
              <Link 
                to="/" 
                className="sidebar-menu-item"
                onClick={handleMenuItemClick}
              >
                <FaHome />
                <span>{t('الصفحة الرئيسية', 'Home Page')}</span>
              </Link>

              <button 
                className="sidebar-menu-item logout"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>{t('تسجيل خروج', 'Logout')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileSidebar;
