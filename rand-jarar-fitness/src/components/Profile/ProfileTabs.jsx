import { motion } from 'framer-motion';
import { FaUser, FaUtensils, FaDumbbell, FaComments, FaCreditCard } from 'react-icons/fa';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const { t } = useProfileLanguage();

  const tabs = [
    { id: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: <FaUser /> },
    { id: 'nutrition', labelAr: 'التغذية', labelEn: 'Nutrition', icon: <FaUtensils /> },
    { id: 'workout', labelAr: 'التمارين', labelEn: 'Workout', icon: <FaDumbbell /> },
    { id: 'chat', labelAr: 'الرسائل', labelEn: 'Messages', icon: <FaComments />, badge: 0 },
    { id: 'payment', labelAr: 'الدفع', labelEn: 'Payment', icon: <FaCreditCard /> }
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
          {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
        </motion.div>
      ))}
    </div>
  );
};

export default ProfileTabs;