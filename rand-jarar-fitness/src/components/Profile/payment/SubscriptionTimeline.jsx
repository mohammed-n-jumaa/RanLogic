import { motion } from 'framer-motion';
import { FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';

const SubscriptionTimeline = ({ userData, delay }) => {
  const { t } = useProfileLanguage();

  const calculateDaysLeft = () => {
    if (!userData.subscription_end_date) return 0;
    
    const endDate = new Date(userData.subscription_end_date);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString(t('ar-SA', 'en-US'), { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const daysLeft = calculateDaysLeft();

  return (
    <motion.div
      className="subscription-timeline"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <div className="card-header">
        <h3>{t('الجدول الزمني للاشتراك', 'Subscription Timeline')}</h3>
        <FaCalendarAlt className="header-icon" />
      </div>

      <div className="timeline">
        <div className="timeline-item active">
          <div className="timeline-icon">
            <FaCheckCircle />
          </div>
          <div className="timeline-content">
            <h5>{t('بداية الاشتراك', 'Subscription Start')}</h5>
            <span>{formatDate(userData.subscription_start_date)}</span>
          </div>
        </div>

        <div className="timeline-item upcoming">
          <div className="timeline-icon">
            <FaClock />
          </div>
          <div className="timeline-content">
            <h5>{t('نهاية الاشتراك', 'Subscription End')}</h5>
            <span>{formatDate(userData.subscription_end_date)}</span>
            <span className="days-left">{daysLeft} {t('يوم متبقي', 'days left')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionTimeline;