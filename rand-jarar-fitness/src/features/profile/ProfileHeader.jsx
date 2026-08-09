import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrophy, FaFire, FaCalendarAlt, FaEdit,
  FaBell, FaInfoCircle, FaCheck, FaComments,
} from 'react-icons/fa';
import EditProfileModal from './EditProfileModal';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const ProfileHeader = ({ userData, onProfileUpdate, unreadCount = 0, recentMessages = [], onOpenChat }) => {
  const [isEditModalOpen, setIsEditModalOpen]     = useState(false);
  const [isReminderVisible, setIsReminderVisible] = useState(true);
  const [isBellOpen, setIsBellOpen]               = useState(false);
  const [dropdownPos, setDropdownPos]             = useState({ top: 0, right: 0 });
  const bellBtnRef = useRef(null);
  const dropdownRef = useRef(null);
  const { t } = useProfileLanguage();

  // احسب position الـ dropdown بناءً على موقع الزر
  const openDropdown = () => {
    if (bellBtnRef.current) {
      const rect = bellBtnRef.current.getBoundingClientRect();
      const dropdownWidth = window.innerWidth < 480 ? 260 : 300;
      const margin = 8;

      // احسب right من يمين الـ window
      let rightVal = window.innerWidth - rect.right;

      // إذا الـ dropdown رح يطلع برا الشاشة من اليسار، اضبطه
      const leftEdge = rect.right - dropdownWidth;
      if (leftEdge < margin) {
        rightVal = window.innerWidth - rect.right - (leftEdge - margin);
      }

      // تأكد ما يطلع برا الشاشة من اليمين
      rightVal = Math.max(margin, Math.min(rightVal, window.innerWidth - dropdownWidth - margin));

      setDropdownPos({
        top:   rect.bottom + window.scrollY + 8,
        right: rightVal,
      });
    }
    setIsBellOpen(prev => !prev);
  };

  // إغلاق عند الضغط برا
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        bellBtnRef.current && !bellBtnRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveProfile = async (updatedData) => {
    try {
      await onProfileUpdate(updatedData);
    } catch (error) {
      throw new Error(t('فشل في تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.', 'Failed to update profile. Please try again.'));
    }
  };

  const getAvatarUrl = () => {
    if (!userData?.avatar_url) return 'https://i.postimg.cc/WpqHf2CH/download.png';
    const defaults = [
      'https://i.postimg.cc/WpqHf2CH/download.png',
      'default-avatar-female.png', 'default-avatar-male.png',
      '/images/default-avatar-female.png', '/images/default-avatar-male.png',
    ];
    const isDefault = defaults.some(d => userData.avatar_url.includes(d));
    if (isDefault) {
      if (userData.gender === 'male')   return 'https://i.postimg.cc/VNmvRfK2/0b90cfaf-8167-4730-8de0-8872054ff0c5.jpg';
      if (userData.gender === 'female') return 'https://i.postimg.cc/bvmy9QDq/fee021a6-b60e-4456-abc4-6febcb2353c4.jpg';
    }
    return userData.avatar_url;
  };

  const calculateDaysLeft = () => {
    if (!userData.subscription_end_date) return 0;
    const diff = Math.ceil((new Date(userData.subscription_end_date) - new Date()) / 86400000);
    return diff > 0 ? diff : 0;
  };

  const calculateProgress = () => {
    if (!userData.subscription_start_date || !userData.subscription_end_date) return 0;
    const start = new Date(userData.subscription_start_date);
    const end   = new Date(userData.subscription_end_date);
    const today = new Date();
    const total   = Math.ceil((end - start)  / 86400000);
    const elapsed = Math.ceil((today - start) / 86400000);
    return Math.round(Math.min(Math.max((elapsed / total) * 100, 0), 100));
  };

  const formatMessageTime = (msg) => {
    const raw = msg.created_at || msg.timestamp;
    if (!raw) return '';
    const d = new Date(raw);
    return isNaN(d) ? raw : d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleGoToChat = () => {
    setIsBellOpen(false);
    onOpenChat?.();
  };

  const daysLeft = calculateDaysLeft();
  const progress = calculateProgress();
  const hasUnread = unreadCount > 0;

  return (
    <>
      <motion.div
        className="profile-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {isReminderVisible && (
          <motion.div
            className="profile-reminder compact"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="reminder-content">
              <div className="reminder-icon"><FaInfoCircle /></div>
              <div className="reminder-text">
                <p className="reminder-message">
                  <strong>{t('فحص الملف الشخصي:', 'Profile Check:')}</strong>{' '}
                  {t('تحقق من صحة معلوماتك للحصول على خطط لياقة مخصصة.', 'Verify your information is accurate for personalized fitness plans.')}
                </p>
                <div className="reminder-actions">
                  <button className="review-btn" onClick={() => setIsEditModalOpen(true)}>
                    <FaEdit /> {t('تحديث', 'Update')}
                  </button>
                  <button className="dismiss-btn" onClick={() => setIsReminderVisible(false)}>
                    <FaCheck /> {t('تم', 'Done')}
                  </button>
                </div>
              </div>
              <button className="close-reminder" onClick={() => setIsReminderVisible(false)}>&times;</button>
            </div>
          </motion.div>
        )}

        <div className="header-gradient"></div>

        <div className="header-content">
          <div className="profile-info">
            <motion.div className="avatar-wrapper" whileHover={{ scale: 1.05 }}>
              <img
                src={getAvatarUrl()}
                alt={userData?.name || 'User'}
                className="avatar"
                onError={(e) => { e.target.src = 'https://i.postimg.cc/WpqHf2CH/download.png'; }}
              />
              <div className="avatar-badge"><FaTrophy /></div>
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
            {/* ── زر الجرس ── */}
            <motion.button
              ref={bellBtnRef}
              className={`action-btn notification${hasUnread ? ' has-unread' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openDropdown}
              aria-label={t('الإشعارات', 'Notifications')}
            >
              <FaBell />
              {hasUnread && (
                <motion.span
                  className="notification-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* ── زر تعديل ── */}
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

      {/* ── Dropdown — خارج profile-header تماماً، position: fixed ── */}
      <AnimatePresence>
        {isBellOpen && (
          <motion.div
            ref={dropdownRef}
            className="bell-dropdown"
            style={{ top: dropdownPos.top, right: dropdownPos.right }}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: -8,    scale: 0.95 }}
            transition={{ duration: 0.18 }}
          >
            <div className="bell-dropdown-header">
              <FaComments />
              <span>{t('رسائل المدربة', "Trainer's Messages")}</span>
              {hasUnread && <span className="dropdown-badge">{unreadCount}</span>}
            </div>

            <div className="bell-dropdown-body">
              {recentMessages.length === 0 ? (
                <p className="bell-empty">{t('لا توجد رسائل جديدة', 'No new messages')}</p>
              ) : (
                recentMessages.map((msg, i) => (
                  <div key={msg.id ?? i} className={`bell-message-item${!msg.is_read ? ' unread' : ''}`}>
                    <p className="bell-message-text">
                      {msg.content?.length > 80 ? msg.content.slice(0, 80) + '…' : msg.content}
                    </p>
                    <span className="bell-message-time">{formatMessageTime(msg)}</span>
                  </div>
                ))
              )}
            </div>

            <button className="bell-dropdown-footer" onClick={handleGoToChat}>
              <FaComments /> {t('فتح المحادثة', 'Open Chat')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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