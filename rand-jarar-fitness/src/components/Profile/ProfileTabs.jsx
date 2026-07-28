import { motion } from 'framer-motion';
import { FaUser, FaUtensils, FaDumbbell, FaComments, FaCreditCard, FaThLarge } from 'react-icons/fa';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const ProfileTabs = ({ activeTab, setActiveTab, unreadCount = 0 }) => {
  const { t } = useProfileLanguage();

  const tabs = [
   { id: 'dashboard', labelAr: 'لوحة التحكم', labelEn: 'Dashboard', icon: <FaThLarge /> },
    { id: 'nutrition', labelAr: 'التغذية',   labelEn: 'Nutrition', icon: <FaUtensils /> },
    { id: 'workout',   labelAr: 'التمارين',  labelEn: 'Workout',   icon: <FaDumbbell /> },
    { id: 'chat',      labelAr: 'الرسائل',   labelEn: 'Messages',  icon: <FaComments />, badge: unreadCount },
    { id: 'payment',   labelAr: 'الدفع',     labelEn: 'Payment',   icon: <FaCreditCard /> },
  ];

  return (
    <div className="profile-tabs">
      {tabs.map((tab) => (
        <motion.div
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{t(tab.labelAr, tab.labelEn)}</span>
          {tab.badge > 0 && (
            <motion.span
              className="tab-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {tab.badge > 99 ? '99+' : tab.badge}
            </motion.span>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ProfileTabs;