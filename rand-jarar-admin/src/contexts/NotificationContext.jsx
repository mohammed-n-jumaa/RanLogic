import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUnreadNotificationsCount, getNotifications, markNotificationsAsRead } from '../api/chatApi';
import { useAuth } from './AuthContext';
import { t } from '../i18n';

const POLL_INTERVAL = 30000;

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // جلب عدد الإشعارات غير المقروءة
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadNotificationsCount();
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  // جلب الإشعارات
  const fetchNotifications = useCallback(async (limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getNotifications(limit);
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (err) {
      setError(t('حدث خطأ أثناء جلب الإشعارات'));
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // تحديد جميع الإشعارات كمقروءة
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await markNotificationsAsRead();
      if (response.success) {
        setUnreadCount(0);
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, is_read: true }))
        );
      }
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  }, []);

  // إضافة إشعار جديد (للاستخدام مع WebSockets في المستقبل)
  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  // إزالة إشعار
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // تحديث الإشعارات دورياً (كل 30 ثانية) — فقط عند تسجيل الدخول والتبويب ظاهر
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      setNotifications([]);
      return;
    }

    let interval = null;

    const start = () => {
      if (interval) return;
      fetchUnreadCount();
      interval = setInterval(fetchUnreadCount, POLL_INTERVAL);
    };

    const stop = () => {
      clearInterval(interval);
      interval = null;
    };

    // إيقاف التحديث عند إخفاء التبويب، واستئنافه (مع جلب فوري) عند الرجوع
    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isAuthenticated, fetchUnreadCount]);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAllAsRead,
    addNotification,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;