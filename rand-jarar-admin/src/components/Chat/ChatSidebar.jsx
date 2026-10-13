// src/components/Chat/ChatSidebar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Info,
  Calendar,
  Target,
  Weight,
  Ruler,
  TrendingUp,
  FileText,
  MessageSquare
} from 'lucide-react';
import './ChatSidebar.scss';
import { t } from '../../i18n';

const ChatSidebar = () => {
  // Mock quick actions
  const quickActions = [
    { id: 1, icon: <Calendar size={18} />, label: t('حجز جلسة'), color: '#4caf50' },
    { id: 2, icon: <FileText size={18} />, label: t('إرسال برنامج'), color: '#2196f3' },
    { id: 3, icon: <Target size={18} />, label: t('تحديث هدف'), color: '#ff9800' },
    { id: 4, icon: <MessageSquare size={18} />, label: t('قوالب رسائل'), color: '#9c27b0' }
  ];

  return (
    <motion.div
      className="chat-sidebar"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="chat-sidebar__header">
        <h3 className="chat-sidebar__title">
          <Info size={20} />
          {t('معلومات سريعة')}
        </h3>
      </div>

      <div className="chat-sidebar__quick-actions">
        <h4 className="chat-sidebar__section-title">{t('إجراءات سريعة')}</h4>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <motion.button
              key={action.id}
              className="quick-action-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ '--action-color': action.color }}
            >
              <div className="quick-action-btn__icon">
                {action.icon}
              </div>
              <span className="quick-action-btn__label">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="chat-sidebar__client-stats">
        <h4 className="chat-sidebar__section-title">{t('إحصائيات المتدرب')}</h4>
        <div className="client-stats-grid">
          <div className="client-stat">
            <div className="client-stat__icon">
              <Weight size={16} />
            </div>
            <div className="client-stat__content">
              <span className="client-stat__label">{t('الوزن الحالي')}</span>
              <span className="client-stat__value">{t('65 كغ')}</span>
            </div>
          </div>

          <div className="client-stat">
            <div className="client-stat__icon">
              <Ruler size={16} />
            </div>
            <div className="client-stat__content">
              <span className="client-stat__label">{t('الطول')}</span>
              <span className="client-stat__value">{t('165 سم')}</span>
            </div>
          </div>

          <div className="client-stat">
            <div className="client-stat__icon">
              <TrendingUp size={16} />
            </div>
            <div className="client-stat__content">
              <span className="client-stat__label">{t('مستوى النشاط')}</span>
              <span className="client-stat__value">{t('متوسط')}</span>
            </div>
          </div>

          <div className="client-stat">
            <div className="client-stat__icon">
              <Target size={16} />
            </div>
            <div className="client-stat__content">
              <span className="client-stat__label">{t('الهدف الحالي')}</span>
              <span className="client-stat__value">{t('إنقاص الوزن')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-sidebar__message-templates">
        <h4 className="chat-sidebar__section-title">{t('قوالب الرسائل')}</h4>
        <div className="message-templates">
          <button className="message-template">
            {t('"كيف كان تمرين اليوم؟"')}
          </button>
          <button className="message-template">
            {t('"هل لديك أي أسئلة حول التغذية؟"')}
          </button>
          <button className="message-template">
            {t('"متى يناسبك موعد الجلسة القادمة؟"')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatSidebar;