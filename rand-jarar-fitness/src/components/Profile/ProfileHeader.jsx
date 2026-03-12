import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTrophy, 
  FaFire, 
  FaCalendarAlt, 
  FaEdit, 
  FaBell,
  FaInfoCircle,
  FaCheck
} from 'react-icons/fa';
import EditProfileModal from './EditProfileModal';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const ProfileHeader = ({ userData, onProfileUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReminderVisible, setIsReminderVisible] = useState(true);
  const { t } = useProfileLanguage();

  const handleSaveProfile = async (updatedData) => {
    try {
      await onProfileUpdate(updatedData);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error(t('فشل في تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.', 'Failed to update profile. Please try again.'));
    }
  };

  // الحصول على الصورة المناسبة مع ضبط للعرض الكامل
  const getAvatarUrl = () => {
    if (!userData?.avatar_url) {
      return 'https://i.postimg.cc/WpqHf2CH/download.png'; // صورة افتراضية
    }
    
    // قائمة بالصور الافتراضية
    const defaultAvatars = [
      'https://i.postimg.cc/WpqHf2CH/download.png',
      'default-avatar-female.png',
      'default-avatar-male.png',
      '/images/default-avatar-female.png',
      '/images/default-avatar-male.png'
    ];
    
    const isDefault = defaultAvatars.some(defaultAvatar => 
      userData.avatar_url.includes(defaultAvatar)
    );
    
    // إذا كانت الصورة افتراضية، نستخدم الصور الجديدة
    if (isDefault) {
      if (userData.gender === 'male') {
        return 'https://i.postimg.cc/VNmvRfK2/0b90cfaf-8167-4730-8de0-8872054ff0c5.jpg';
      } else if (userData.gender === 'female') {
        return 'https://i.postimg.cc/bvmy9QDq/fee021a6-b60e-4456-abc4-6febcb2353c4.jpg';
      }
      return 'https://i.postimg.cc/WpqHf2CH/download.png';
    }
    
    return userData.avatar_url;
  };

  // Calculate days left
  const calculateDaysLeft = () => {
    if (!userData.subscription_end_date) return 0;
    
    const endDate = new Date(userData.subscription_end_date);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!userData.subscription_start_date || !userData.subscription_end_date) return 0;
    
    const startDate = new Date(userData.subscription_start_date);
    const endDate = new Date(userData.subscription_end_date);
    const today = new Date();
    
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    
    const progress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
    return Math.round(progress);
  };

  const daysLeft = calculateDaysLeft();
  const progress = calculateProgress();

  return (
    <>
      <motion.div 
        className="profile-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Compact Reminder Message */}
        {isReminderVisible && (
          <motion.div 
            className="profile-reminder compact"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="reminder-content">
              <div className="reminder-icon">
                <FaInfoCircle />
              </div>
              <div className="reminder-text">
                <p className="reminder-message">
                  <strong>{t('فحص الملف الشخصي:', 'Profile Check:')}</strong> {t('تحقق من صحة معلوماتك للحصول على خطط لياقة مخصصة.', 'Verify your information is accurate for personalized fitness plans.')}
                </p>
                <div className="reminder-actions">
                  <button 
                    className="review-btn"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <FaEdit /> {t('تحديث', 'Update')}
                  </button>
                  <button 
                    className="dismiss-btn"
                    onClick={() => setIsReminderVisible(false)}
                  >
                    <FaCheck /> {t('تم', 'Done')}
                  </button>
                </div>
              </div>
              <button 
                className="close-reminder"
                onClick={() => setIsReminderVisible(false)}
                aria-label={t('إغلاق التذكير', 'Close reminder')}
              >
                &times;
              </button>
            </div>
          </motion.div>
        )}

        <div className="header-gradient"></div>
        
        <div className="header-content">
          <div className="profile-info">
            <motion.div 
              className="avatar-wrapper"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src={getAvatarUrl()} 
                alt={userData?.name || 'User'} 
                className="avatar"
                onError={(e) => {
                  e.target.src = 'https://i.postimg.cc/WpqHf2CH/download.png';
                }}
              />
              <div className="avatar-badge">
                <FaTrophy />
              </div>
            </motion.div>
            
            <div className="info-text">
              <h1>{userData?.name || t('المستخدم', 'User')}</h1>
              <p className="program-name">{userData?.program || t('برنامج تدريبي', 'Training Program')}</p>
              <div className="stats-mini">
                <span><FaFire /> {progress}% {t('مكتمل', 'Complete')}</span>
                <span><FaCalendarAlt /> {daysLeft} {t('يوم متبقي', 'days left')}</span>
              </div>
            </div>
          </div>
          
          <div className="quick-actions">
            <motion.button 
              className="action-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditModalOpen(true)}
            >
              <FaEdit /> {t('تعديل الملف الشخصي', 'Edit Profile')}
            </motion.button>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-info">
            <span>{t('تقدم البرنامج', 'Program Progress')}</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onSave={handleSaveProfile}
      />
    </>
  );
};

export default ProfileHeader;