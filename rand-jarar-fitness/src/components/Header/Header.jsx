import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaGlobe, FaSpinner, FaSignOutAlt, FaUserCircle, FaCrown } from 'react-icons/fa';
import Auth from '../Auth/Auth';
import { useLanguage } from '../../contexts/LanguageContext';
import authApi from '../../api/authApi';
import logoApi from '../../api/logoApi';
import './Header.scss';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [logoLoading, setLogoLoading] = useState(true);
  const [logoError, setLogoError] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  
  const { currentLang, changeLanguage, isLoading: languageLoading } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const userDropdownRef = useRef(null);

  // الصورة الافتراضية للمستخدم حسب الجنس
  const getDefaultAvatar = (user) => {
    console.log('User data in getDefaultAvatar:', user);
    
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
      console.log('Using custom avatar:', user.avatar_url);
      return user.avatar_url;
    }
    
    console.log('User gender:', user.gender);
    
    if (user.gender === 'male') {
      console.log('Returning male avatar');
      return 'https://i.postimg.cc/VNmvRfK2/0b90cfaf-8167-4730-8de0-8872054ff0c5.jpg';
    } else if (user.gender === 'female') {
      console.log('Returning female avatar');
      return 'https://i.postimg.cc/bvmy9QDq/fee021a6-b60e-4456-abc4-6febcb2353c4.jpg';
    }
    
    console.log('No gender found, using fallback');
    return 'https://i.postimg.cc/WpqHf2CH/download.png';
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (menuOpen || userDropdownOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen, userDropdownOpen]);

  useEffect(() => {
    fetchActiveLogo();
    fetchCurrentUser();
  }, []);

  const fetchActiveLogo = async () => {
    try {
      setLogoLoading(true);
      setLogoError(null);
      const response = await logoApi.getActiveLogo();
      if (response.success && response.data) {
        setLogoData(response.data);
      }
    } catch (err) {
      console.error('Error fetching logo:', err);
      setLogoError('فشل في تحميل الشعار');
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
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginClick = () => {
    if (user) {
      if (user.has_active_subscription) {
        navigate('/profile');
      } else {
        navigate('/plans');
      }
    } else {
      setShowAuth(true);
      setMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setUserDropdownOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLanguageToggle = async () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    await changeLanguage(newLang);
    setMenuOpen(false);
  };

  // البيانات الثابتة للروابط
  const pageLinks = currentLang === 'ar' ? [
    { name: 'الرئيسية', path: '/' },
    { name: 'الأسئلة الشائعة', path: '/faq' }
  ] : [
    { name: 'Home', path: '/' },
    { name: 'FAQ', path: '/faq' }
  ];

  const sectionLinks = currentLang === 'ar' ? [
    { name: 'عن المدرب', href: '#about' },
    { name: 'آراء العملاء', href: '#testimonials' }
  ] : [
    { name: 'About Coach', href: '#about' },
    { name: 'Testimonials', href: '#testimonials' }
  ];

  const isHomePage = location.pathname === '/';
  const showBookNowButton = !user;

  return (
    <>
      <AnimatePresence>
        {showAuth && <Auth isOpen={showAuth} onClose={() => setShowAuth(false)} />}
      </AnimatePresence>

      {menuOpen && (
        <motion.div 
          className="menu-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMenuOpen(false)}
        />
      )}
      
      <motion.header 
        className={`header ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-container">
          {/* ✅ رابط الشعار - مع أبعاد ثابتة لمنع CLS */}
          <Link to="/" className="logo-link">
            <motion.div 
              className="logo"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ 
                width: '180px',
                height: '60px',
                position: 'relative'
              }}
            >
              {logoLoading ? (
                <div className="logo-loading" style={{ width: '180px', height: '60px' }}>
                  <FaSpinner className="spinner" />
                </div>
              ) : logoError ? (
                <div className="logo-error" style={{ width: '180px', height: '60px' }}>
                  <span className="error-text">Logo</span>
                </div>
              ) : logoData ? (
                <img 
                  src={logoData.file_url} 
                  alt={currentLang === 'ar' ? 'شعار رند جرار للرياضة' : 'Rand Jarar Fitness Logo'} 
                  className="logo-image"
                  width="180"
                  height="60"
                  loading="eager"
                  style={{
                    width: '180px',
                    height: '60px',
                    objectFit: 'contain',
                    aspectRatio: '180/60'
                  }}
                  onError={(e) => {
                    console.error('Failed to load logo image');
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = 
                      '<span class="fallback-logo" style="width:180px;height:60px;display:flex;align-items:center;justify-content:center;">RJ</span>';
                  }}
                />
              ) : (
                <div className="logo-placeholder" style={{ width: '180px', height: '60px' }}>
                  <span className="placeholder-text">RJ</span>
                </div>
              )}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`nav desktop-nav`}>
            {pageLinks.map((link) => (
              <Link key={link.name} to={link.path} className="nav-link">
                {link.name}
              </Link>
            ))}

            {isHomePage && sectionLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="nav-link"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {link.name}
              </motion.a>
            ))}
          </nav>

          <div className="mobile-left">
            <button 
              className={`menu-toggle ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={currentLang === 'ar' ? 'فتح/إغلاق القائمة' : 'Toggle menu'}
              aria-expanded={menuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          <div className="mobile-right">
            <motion.button
              className="language-button-mobile"
              onClick={handleLanguageToggle}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              disabled={languageLoading}
              aria-label={currentLang === 'ar' ? 'تغيير اللغة' : 'Change language'}
            >
              {languageLoading ? (
                <FaSpinner className="spinner" />
              ) : (
                <FaGlobe className="language-icon" />
              )}
            </motion.button>
          </div>

          <div className="header-actions">
            <motion.button
              className="language-button desktop-only"
              onClick={handleLanguageToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={languageLoading}
              aria-label={currentLang === 'ar' ? 'تغيير اللغة' : 'Change language'}
            >
              {languageLoading ? (
                <FaSpinner className="spinner" />
              ) : (
                <>
                  <FaGlobe className="language-icon" />
                  <span className="language-text">
                    {currentLang === 'en' ? 'AR' : 'EN'}
                  </span>
                </>
              )}
            </motion.button>

            {/* User Area */}
            {userLoading ? (
              <div className="user-loading desktop-only">
                <FaSpinner className="spinner" />
              </div>
            ) : user ? (
              <div className="user-dropdown-container desktop-only" ref={userDropdownRef}>
                <motion.button
                  className="user-avatar"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-expanded={userDropdownOpen}
                  style={{
                    width: '40px',
                    height: '40px',
                    padding: 0,
                    position: 'relative'
                  }}
                >
                  <img 
                    src={getDefaultAvatar(user)} 
                    alt={user.name} 
                    className="avatar-image"
                    width="40"
                    height="40"
                    loading="lazy"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      aspectRatio: '1/1'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://i.postimg.cc/WpqHf2CH/download.png';
                    }}
                  />
                  {user.has_active_subscription && (
                    <span className="premium-badge" title="Premium User">
                      <FaCrown />
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div 
                      className="user-dropdown"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                        {user.has_active_subscription && (
                          <div className="user-status premium">
                            <FaCrown /> {currentLang === 'ar' ? 'مشترك مميز' : 'Premium Member'}
                          </div>
                        )}
                      </div>
                      
                      <div className="dropdown-divider"></div>
                      
                      <button 
                        className="dropdown-item"
                        onClick={() => {
                          if (user.has_active_subscription) {
                            navigate('/profile');
                          } else {
                            navigate('/plans');
                          }
                          setUserDropdownOpen(false);
                        }}
                      >
                        <FaUserCircle />
                        <span>{user.has_active_subscription 
                          ? (currentLang === 'ar' ? 'الملف الشخصي' : 'Profile')
                          : (currentLang === 'ar' ? 'اشترك الآن' : 'Subscribe Now')
                        }</span>
                      </button>
                      
                      <button 
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt />
                        <span>{currentLang === 'ar' ? 'تسجيل خروج' : 'Logout'}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                className="login-button desktop-only"
                onClick={handleLoginClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUser className="login-icon" />
                {currentLang === 'ar' ? 'تسجيل دخول' : 'Login'}
              </motion.button>
            )}

            {showBookNowButton && (
              <motion.button 
                className="cta-button"
                onClick={() => navigate('/plans')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentLang === 'ar' ? 'احجز الآن' : 'Book Now'}
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      <nav className={`nav mobile-nav ${menuOpen ? 'open' : ''}`}>
        {pageLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        {isHomePage && sectionLinks.map((link) => (
          <motion.a
            key={link.name}
            href={link.href}
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            {link.name}
          </motion.a>
        ))}

        <div className="nav-divider"></div>

        {user ? (
          <>
            <div className="mobile-user-info">
              <div className="mobile-user-avatar">
                <img 
                  src={getDefaultAvatar(user)} 
                  alt={user.name} 
                  className="avatar-image"
                  width="40"
                  height="40"
                  loading="lazy"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    aspectRatio: '1/1'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://i.postimg.cc/WpqHf2CH/download.png';
                  }}
                />
              </div>
              <div className="mobile-user-details">
                <div className="mobile-user-name">{user.name}</div>
                <div className="mobile-user-status">
                  {user.has_active_subscription 
                    ? (currentLang === 'ar' ? 'مشترك مميز' : 'Premium Member')
                    : (currentLang === 'ar' ? 'غير مشترك' : 'Not Subscribed')
                  }
                </div>
              </div>
            </div>
            
            <motion.button
              className="login-button mobile-menu"
              onClick={() => {
                if (user.has_active_subscription) {
                  navigate('/profile');
                } else {
                  navigate('/plans');
                }
                setMenuOpen(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaUser className="login-icon" />
              {user.has_active_subscription 
                ? (currentLang === 'ar' ? 'الملف الشخصي' : 'My Profile')
                : (currentLang === 'ar' ? 'اشترك الآن' : 'Subscribe Now')
              }
            </motion.button>
            
            <motion.button
              className="logout-button mobile-menu"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaSignOutAlt className="logout-icon" />
              {currentLang === 'ar' ? 'تسجيل خروج' : 'Logout'}
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              className="login-button mobile-menu"
              onClick={() => {
                setShowAuth(true);
                setMenuOpen(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaUser className="login-icon" />
              {currentLang === 'ar' ? 'تسجيل دخول' : 'Login'}
            </motion.button>
            
            {showBookNowButton && (
              <motion.button
                className="cta-button mobile-menu"
                onClick={() => {
                  navigate('/plans');
                  setMenuOpen(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currentLang === 'ar' ? 'احجز الآن' : 'Book Now'}
              </motion.button>
            )}
          </>
        )}
      </nav>
    </>
  );
};

export default Header;