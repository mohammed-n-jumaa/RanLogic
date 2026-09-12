import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Bell, ExternalLink, MessageSquare, Check } from 'lucide-react';
import { useTheme } from '../../../contexts';
import { useNotifications } from '../../../contexts/NotificationContext';
import Badge from '../../common/Badge';
import { sidebarSections } from '../../../data/sidebarData';
import './Header.scss';

// Map routes to page names
const getPageName = (pathname) => {
  for (const section of sidebarSections) {
    if (!section.items) continue;
    for (const item of section.items) {
      if (pathname === item.path || pathname.startsWith(item.path + '/')) {
        return item.label;
      }
    }
  }
  return 'لوحة التحكم';
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAllAsRead,
  } = useNotifications();

  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  const pageName = getPageName(location.pathname);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch notifications when opened
  useEffect(() => {
    if (showNotifs) fetchNotifications();
  }, [showNotifs, fetchNotifications]);

  const handleNotifClick = (n) => {
    if (n.trainee_id) {
      navigate(`/chat/${n.trainee_id}`);
      setShowNotifs(false);
    }
  };

  const handlePreview = () => {
    window.open('https://ranlogic.com/', '_blank');
  };

  return (
    <header className="hdr">
      <div className="hdr__bar">
        {/* Page name */}
        <button className="hdr__page">
          <span className="hdr__page-dot" />
          <span className="hdr__page-name">{pageName}</span>
        </button>

        <div className="hdr__sep" />

        {/* Notifications */}
        <div className="hdr__notif-wrap" ref={notifRef}>
          <button
            className={`hdr__btn ${showNotifs ? 'hdr__btn--active' : ''}`}
            onClick={() => setShowNotifs(!showNotifs)}
            aria-label="الإشعارات"
          >
            <Bell size={16} />
            {unreadCount > 0 && <span className="hdr__btn-dot" />}
          </button>

          {/* Notifications dropdown */}
          <AnimatePresence>
            {showNotifs && (
              <motion.div
                className="hdr__dropdown"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="hdr__dropdown-head">
                  <h3>
                    <MessageSquare size={16} />
                    الإشعارات
                  </h3>
                  {unreadCount > 0 && (
                    <button className="hdr__dropdown-mark" onClick={markAllAsRead}>
                      <Check size={13} /> تحديد الكل كمقروء
                    </button>
                  )}
                </div>

                <div className="hdr__dropdown-list">
                  {notifications.length === 0 ? (
                    <div className="hdr__dropdown-empty">
                      <Bell size={28} />
                      <p>لا توجد إشعارات</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`hdr__notif-item ${!n.is_read ? 'hdr__notif-item--unread' : ''}`}
                        onClick={() => handleNotifClick(n)}
                      >
                        <div className="hdr__notif-av">
                          {n.trainee_avatar ? (
                            <img src={n.trainee_avatar} alt="" />
                          ) : (
                            <span>{n.trainee_name?.charAt(0) || '?'}</span>
                          )}
                        </div>
                        <div className="hdr__notif-body">
                          <p className="hdr__notif-title">{n.title}</p>
                          <p className="hdr__notif-text">{n.body}</p>
                          <span className="hdr__notif-time">{n.time_ago}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="hdr__dropdown-foot">
                  <button onClick={() => { navigate('/chat'); setShowNotifs(false); }}>
                    عرض جميع المحادثات
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <button className="hdr__btn" onClick={toggleTheme} aria-label="تبديل الثيم">
          <motion.div
            initial={false}
            animate={{ rotate: isDarkMode ? 0 : 180 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {isDarkMode ? <Sun size={16} className="hdr__sun" /> : <Moon size={16} />}
          </motion.div>
        </button>

        <div className="hdr__sep" />

        {/* Preview */}
        <button className="hdr__preview" onClick={handlePreview}>
          <ExternalLink size={14} />
          <span>معاينة</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
