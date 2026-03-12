import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';

const PaymentStatusCard = ({ userData, delay }) => {
  const { t } = useProfileLanguage();

  const isPaid = userData.has_active_subscription;
  
  const calculateDaysLeft = () => {
    if (!userData.subscription_end_date) return 0;
    
    const endDate = new Date(userData.subscription_end_date);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const daysUntilExpiry = calculateDaysLeft();
  const isExpiringSoon = daysUntilExpiry <= 7;

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
      className="payment-status-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <div className="card-header">
        <h3>{t('حالة الاشتراك', 'Subscription Status')}</h3>
        {isPaid ? (
          <FaCheckCircle className="status-icon paid" />
        ) : (
          <FaClock className="status-icon pending" />
        )}
      </div>

      <div className="payment-details">
        <div className="payment-item">
          <span>{t('البرنامج', 'Program')}</span>
          <span>{userData.program || t('برنامج تدريبي', 'Training Program')}</span>
        </div>

        <div className="payment-item">
          <span>{t('تاريخ البدء', 'Start Date')}</span>
          <span>
            <FaCalendarAlt /> {formatDate(userData.subscription_start_date)}
          </span>
        </div>

        <div className="payment-item">
          <span>{t('تاريخ الانتهاء', 'End Date')}</span>
          <span>
            <FaCalendarAlt /> {formatDate(userData.subscription_end_date)}
          </span>
        </div>

        <div className="payment-item highlight">
          <span>{t('الأيام المتبقية', 'Days Remaining')}</span>
          <span className={`days-left ${isExpiringSoon ? 'warning' : ''}`}>
            {daysUntilExpiry} {t('يوم', 'days')}
          </span>
        </div>

        <div className="payment-item status">
          <span>{t('حالة الاشتراك', 'Subscription Status')}</span>
          <span className={`status-badge ${isPaid ? 'paid' : 'pending'}`}>
            <FaCheckCircle />
            {isPaid ? t('نشط', 'Active') : t('منتهي', 'Expired')}
          </span>
        </div>
      </div>

      {isExpiringSoon && isPaid && (
        <div className="expiry-warning">
          <FaExclamationTriangle />
          <p>
            {t('اشتراكك على وشك الانتهاء! جدد الآن للاستمرار.', 'Your subscription is about to expire! Renew now to continue.')}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentStatusCard;