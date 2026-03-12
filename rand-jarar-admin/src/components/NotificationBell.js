import React, { useState, useEffect } from 'react';
import chatApi from '../api/ChatContext';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await chatApi.getNotifications();
        setNotifications(response);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notificationId) => {
    try {
      await chatApi.markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="notification-bell">
      <button className="bell-button">
        <span className="bell-icon">🔔</span>
        {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
      </button>
      {notifications.length > 0 && (
        <div className="notifications-dropdown">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="notification-item"
              onClick={() => handleNotificationClick(notification.id)}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
