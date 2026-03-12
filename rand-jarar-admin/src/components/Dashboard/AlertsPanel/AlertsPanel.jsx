import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, Users, Calendar } from 'lucide-react';
import './AlertsPanel.scss';

const AlertsPanel = ({ alerts = [] }) => {
  const defaultAlerts = alerts.length > 0 ? alerts : [
    {
      id: 1,
      type: 'warning',
      title: 'اشتراكات تنتهي خلال 3 أيام',
      count: 8,
      icon: 'Clock',
      color: '#ff9800'
    },
    {
      id: 2,
      type: 'info',
      title: 'اشتراكات تنتهي خلال 7 أيام',
      count: 15,
      icon: 'Calendar',
      color: '#2196f3'
    },
    {
      id: 3,
      type: 'danger',
      title: 'مدفوعات متأخرة',
      count: 5,
      icon: 'AlertCircle',
      color: '#f44336'
    },
    {
      id: 4,
      type: 'success',
      title: 'تجديدات هذا الشهر',
      count: 23,
      icon: 'Users',
      color: '#4caf50'
    }
  ];

  // دالة للحصول على الأيقونة المناسبة
  const getIconComponent = (iconName) => {
    switch(iconName) {
      case 'Clock': return Clock;
      case 'Calendar': return Calendar;
      case 'AlertCircle': return AlertCircle;
      case 'Users': return Users;
      default: return AlertCircle;
    }
  };

  return (
    <div className="alerts-panel">
      <div className="alerts-panel__header">
        <AlertCircle size={24} />
        <h3>التنبيهات والإشعارات</h3>
      </div>
      
      <div className="alerts-panel__list">
        {defaultAlerts.map((alert, index) => {
          const IconComponent = getIconComponent(alert.icon);
          return (
            <motion.div
              key={alert.id}
              className={`alert-item alert-item--${alert.type}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="alert-item__icon" style={{ background: `${alert.color}20` }}>
                <IconComponent size={20} style={{ color: alert.color }} />
              </div>
              
              <div className="alert-item__content">
                <h4 className="alert-item__title">{alert.title}</h4>
                <div className="alert-item__count">{alert.count} متدربة</div>
              </div>
              
              <button className="alert-item__action">عرض</button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsPanel;