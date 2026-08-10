import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '../features/profile/ProfileSidebar/ProfileSidebar';
import ProfileHeader from '../features/profile/ProfileHeader';
import ProfileTabs from '../features/profile/ProfileTabs';
import OverviewTab from '../features/overview/OverviewTab';
import NutritionTab from '../features/nutrition/NutritionTab';
import WorkoutTab from '../features/workout/WorkoutTab';
import ChatTab from '../features/chat/ChatTab';
import PaymentTab from '../features/payment/PaymentTab';
import DashboardTab from '../features/dashboard/DashboardTab';
import LanguageToggle from '../features/profile/LanguageToggle/LanguageToggle';
import ScrollToTop from '../components/common/ScrollToTop/ScrollToTop';
import SEO from '../components/common/SEO/SEO';
import { ProfileLanguageProvider } from '../contexts/ProfileLanguageContext';
import { useLanguage } from '../contexts/LanguageContext';
import { breadcrumbs } from '../utils/seoConfig';
import profileApi from '../api/profileApi';
import authApi from '../api/authApi';
import chatApi from '../api/chatApi';
import Swal from 'sweetalert2';
import usePageTitle from '@/hooks/usePageTitle';
import { throttle } from '@/utils/debounce';
import './Profile.scss';

const ProfileContent = () => {
 const navigate = useNavigate();
  const { currentLang } = useLanguage();
  usePageTitle('الملف الشخصي', 'My Profile', currentLang);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => { checkAuthAndFetchData(); }, []);

  // جلب عدد الرسائل غير المقروءة وآخر 3 رسائل من المدربة — بدون فتح/تصفير المحادثة
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await chatApi.getUnreadCount();
      if (response.success && response.data) {
        setUnreadCount(response.data.unread_count ?? 0);
        setRecentMessages(response.data.recent_messages ?? []);
      }
    } catch {
    }
  }, []);

 const handleSetActiveTab = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'chat') {
      setUnreadCount(0);
      setRecentMessages([]);
    }
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const user = authApi.getUser();
      if (!user) { navigate('/auth'); return; }
      await fetchProfileData();
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate('/auth');
    }
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileApi.getMyProfile();
      if (response.success) {
        setUserData(response.data);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.message);
      Swal.fire({
        title: 'خطأ',
        text: 'فشل في تحميل بيانات الملف الشخصي',
        icon: 'error',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#FDB813'
      });
    } finally {
      setLoading(false);
    }
  };

const handleProfileUpdate = useCallback(throttle(async (updatedData) => {
        try {
      const updatePayload = {
        name:           updatedData.name,
        email:          updatedData.email,
        phone:          updatedData.phone || '',
        height:         updatedData.height,
        weight:         updatedData.weight,
        waist:          updatedData.waist,
        hips:           updatedData.hips || null,
        age:            updatedData.age,
        gender:         updatedData.gender,
        goal:           updatedData.goal,
        workout_place:  updatedData.workout_place,
        health_notes:   updatedData.health_notes || '',
        avatar:         updatedData.avatar
      };

      if (updatedData.password && updatedData.password.trim() !== '') {
        updatePayload.password              = updatedData.password;
        updatePayload.password_confirmation = updatedData.password_confirmation;
        updatePayload.current_password      = updatedData.current_password || '';
      }

      const response = await profileApi.updateProfile(updatePayload);

      if (response.success) {
        setUserData(prev => ({ ...prev, ...response.data }));
        const currentUser = authApi.getUser();
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...response.data }));
        return response.data;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error in handleProfileUpdate:', error);
      throw error;
   }
  }, 2000), []);

  const sharedSEO = (
    <SEO
      page="profile"
      noindex={true}
      breadcrumbItems={breadcrumbs.profile(currentLang)}
    />
  );

  if (loading) {
    return (
      <>
        {sharedSEO}
        <div className="profile-page loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>{currentLang === 'ar' ? 'جاري تحميل الملف الشخصي...' : 'Loading profile...'}</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !userData) {
    return (
      <>
        {sharedSEO}
        <div className="profile-page error">
          <div className="error-message">
            <h2>{currentLang === 'ar' ? 'حدث خطأ' : 'An error occurred'}</h2>
            <p>{error || (currentLang === 'ar' ? 'فشل في تحميل البيانات' : 'Failed to load data')}</p>
            <button onClick={fetchProfileData} className="retry-btn">
              {currentLang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        </div>
      </>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'nutrition': return <NutritionTab />;
      case 'workout':   return <WorkoutTab />;
      case 'chat':      return <ChatTab />;
      case 'payment':   return <PaymentTab   userData={userData} />;
      default:          return <OverviewTab  userData={userData} />;
    }
  };

  return (
    <>
      {sharedSEO}

      <div className="profile-page">
        <ProfileSidebar />
        <LanguageToggle />

        <ProfileHeader
          userData={userData}
          onProfileUpdate={handleProfileUpdate}
          unreadCount={unreadCount}
          recentMessages={recentMessages}
          onOpenChat={() => handleSetActiveTab('chat')}
        />

        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          unreadCount={unreadCount}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="profile-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

const Profile = () => (
  <ProfileLanguageProvider>
    <ProfileContent />
  </ProfileLanguageProvider>
);

export default Profile;