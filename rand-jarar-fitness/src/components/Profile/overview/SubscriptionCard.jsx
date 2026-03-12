import { motion } from 'framer-motion';
import { FaDollarSign, FaCheckCircle } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';

const SubscriptionCard = ({ userData, delay }) => {
  const { t } = useProfileLanguage();

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString(t('ar-SA', 'en-US'), { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <motion.div
      className="subscription-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <div className="card-header">
        <h3>{t('تفاصيل الاشتراك', 'Subscription Details')}</h3>
        <FaDollarSign className="header-icon" />
      </div>

      <div className="subscription-details">
        <div className="detail-row">
          <span className="detail-label">{t('البرنامج', 'Program')}</span>
          <span className="detail-value">{userData.program || t('برنامج تدريبي', 'Training Program')}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">{t('تاريخ البدء', 'Start Date')}</span>
          <span className="detail-value">{formatDate(userData.subscription_start_date)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">{t('تاريخ الانتهاء', 'End Date')}</span>
          <span className="detail-value">{formatDate(userData.subscription_end_date)}</span>
        </div>
        <div className="detail-row status">
          <span className="detail-label">{t('حالة الاشتراك', 'Subscription Status')}</span>
          <span className={`payment-status ${userData.has_active_subscription ? 'paid' : 'expired'}`}>
            <FaCheckCircle /> {userData.has_active_subscription ? t('نشط', 'Active') : t('منتهي', 'Expired')}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionCard;