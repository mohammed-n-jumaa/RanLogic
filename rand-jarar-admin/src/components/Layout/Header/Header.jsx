import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, Moon, Sun, Bell, MessageSquare, X, Check } from 'lucide-react';
import { useTheme } from '../../../contexts';
import { useNotifications } from '../../../contexts/NotificationContext';
import Badge from '../../common/Badge';
import './Header.scss';

const Header = ({ currentSection = 'لوحة التحكم' }) => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    markAllAsRead 
  } = useNotifications();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // جلب الإشعارات عند فتح القائمة
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications, fetchNotifications]);

  // الانتقال لمحادثة المتدرب - المسار الصحيح
  const handleNotificationClick = (notification) => {
    if (notification.trainee_id) {
      navigate(`/chat/${notification.trainee_id}`);
      setShowNotifications(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handlePreview = () => {
    window.open('https://rj-website-murex.vercel.app/', '_blank');
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__right">
          <motion.div
            className="header__logo"
            whileHover={{ scale: 1.05 }}
          >
            <span className="header__logo-emoji">💪</span>
          </motion.div>

          <div className="header__section">
            <span className="header__section-label">القسم الحالي</span>
            <h1 className="header__section-title">{currentSection}</h1>
          </div>
        </div>

        <div className="header__center">
          <div className="header__mode-capsule">
            <div className="header__mode-indicator"></div>
            <span className="header__mode-text">وضع المحتوى</span>
          </div>
        </div>

        <div className="header__left">
          {/* Theme Toggle Button */}
          <motion.button
            className="header__action-btn header__theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isDarkMode ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDarkMode ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.div>
          </motion.button>

          {/* Chat Notifications */}
          <div className="header__notifications-wrapper" ref={notificationRef}>
            <motion.button
              className={`header__action-btn header__notifications ${showNotifications ? 'active' : ''}`}
              onClick={() => setShowNotifications(!showNotifications)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="الإشعارات"
            >
              <Bell size={20} />
              {unreadCount > 0 && <Badge count={unreadCount} pulse />}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="notifications-dropdown"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="notifications-dropdown__header">
                    <h3>
                      <MessageSquare size={18} />
                      إشعارات الرسائل
                    </h3>
                    {unreadCount > 0 && (
                      <button 
                        className="notifications-dropdown__mark-read"
                        onClick={handleMarkAllAsRead}
                      >
                        <Check size={14} />
                        تحديد الكل كمقروء
                      </button>
                    )}
                  </div>

                  <div className="notifications-dropdown__list">
                    {notifications.length === 0 ? (
                      <div className="notifications-dropdown__empty">
                        <Bell size={32} />
                        <p>لا توجد إشعارات جديدة</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          className={`notification-item ${!notification.is_read ? 'notification-item--unread' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                          whileHover={{ backgroundColor: 'var(--bg-hover)' }}
                        >
                          <div className="notification-item__avatar">
                            {notification.trainee_avatar ? (
                              <img src={notification.trainee_avatar} alt="" />
                            ) : (
                              <div className="notification-item__avatar-placeholder">
                                {notification.trainee_name?.charAt(0) || '?'}
                              </div>
                            )}
                            {!notification.is_read && (
                              <div className="notification-item__unread-dot" />
                            )}
                          </div>
                          
                          <div className="notification-item__content">
                            <p className="notification-item__title">{notification.title}</p>
                            <p className="notification-item__body">{notification.body}</p>
                            <span className="notification-item__time">{notification.time_ago}</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  <div className="notifications-dropdown__footer">
                    <button 
                      className="notifications-dropdown__view-all"
                      onClick={() => {
                        navigate('/chat');
                        setShowNotifications(false);
                      }}
                    >
                      عرض جميع المحادثات
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            className="header__btn header__btn--secondary"
            onClick={handlePreview}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye size={18} />
            <span>معاينة الموقع</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;