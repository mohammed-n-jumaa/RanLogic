// Shell styles first: the tab stylesheets below must come after its resets
import '../features/profile/shell/ProfileShell.scss';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '../features/profile/shell/ProfileSidebar';
import ProfileTopbar from '../features/profile/shell/ProfileTopbar';
import ProfileBottomNav from '../features/profile/shell/ProfileBottomNav';
import ProfileFeedbackProvider from '../features/profile/shell/ProfileFeedback';
import { PROFILE_TABS, isProfileTab } from '../features/profile/shell/profileShared';
import EditProfileModal from '../features/profile/EditProfileModal';
import OverviewTab from '../features/overview/OverviewTab';
import NutritionTab from '../features/nutrition/NutritionTab';
import WorkoutTab from '../features/workout/WorkoutTab';
import ChatTab from '../features/chat/ChatTab';
import PaymentTab from '../features/payment/PaymentTab';
import DashboardTab from '../features/dashboard/DashboardTab';
import ProfileSkeleton from '../components/common/ProfileSkeleton/ProfileSkeleton';
import SEO from '../components/common/SEO/SEO';
import { ProfileLanguageProvider, useProfileLanguage } from '../contexts/ProfileLanguageContext';
import { breadcrumbs } from '../utils/seoConfig';
import profileApi from '../api/profileApi';
import authApi from '../api/authApi';
import chatApi from '../api/chatApi';
import Swal from 'sweetalert2';
import usePageTitle from '@/hooks/usePageTitle';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { throttle } from '@/utils/debounce';

const THEME_KEY = 'pf-theme';
const initialTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* storage unavailable */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const tabFromHash = () => {
  const id = window.location.hash.slice(1);
  return isProfileTab(id) ? id : 'overview';
};

const ProfileContent = () => {
  const navigate = useNavigate();
  const { t, currentLang } = useProfileLanguage();
  usePageTitle('الملف الشخصي', 'My Profile', currentLang);

  const [activeTab, setActiveTab] = useState(tabFromHash);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [theme, setTheme] = useState(initialTheme);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(THEME_KEY, next); } catch { /* storage unavailable */ }
      return next;
    });
  }, []);

  useEffect(() => { checkAuthAndFetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Unread count + last trainer messages — without opening/resetting the conversation
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await chatApi.getUnreadCount();
      if (response.success && response.data) {
        setUnreadCount(response.data.unread_count ?? 0);
        setRecentMessages(response.data.recent_messages ?? []);
      }
    } catch {
      // badge simply stays hidden
    }
  }, []);

  const selectTab = useCallback((tab) => {
    setActiveTab(tab);
    window.history.replaceState(null, '', `#${tab}`);
    window.scrollTo({ top: 0 });
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
    } catch (err) {
      console.error('Error checking auth:', err);
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
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      Swal.fire({
        title: 'خطأ',
        text: 'فشل في تحميل بيانات الملف الشخصي',
        icon: 'error',
        confirmButtonText: 'حسناً',
        confirmButtonColor: 'var(--site-primary)'
      });
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleProfileUpdate = useCallback(throttle(async (updatedData) => {
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
    if (!response.success) throw new Error('Failed to update profile');

    setUserData(prev => ({ ...prev, ...response.data }));
    const currentUser = authApi.getUser();
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...response.data }));
    return response.data;
  }, 2000), []);

  const handleSaveProfile = async (updatedData) => {
    try {
      await handleProfileUpdate(updatedData);
    } catch {
      throw new Error(t('فشل في تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.', 'Failed to update profile. Please try again.'));
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    navigate('/');
    window.location.reload();
  };

  const sharedSEO = (
    <SEO page="profile" noindex={true} breadcrumbItems={breadcrumbs.profile(currentLang)} />
  );

  if (loading) {
    return <>{sharedSEO}<ProfileSkeleton /></>;
  }

  if (error || !userData) {
    return (
      <>
        {sharedSEO}
        <div className="pf pf--centered" data-theme={theme} dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="pf-card pf-state">
            <span className="pf-state__icon"><AlertCircle /></span>
            <h3>{t('حدث خطأ', 'An error occurred')}</h3>
            <p className="pf-card__sub">{error || t('فشل في تحميل البيانات', 'Failed to load data')}</p>
            <button type="button" className="pf-btn pf-btn--primary" onClick={fetchProfileData}><RefreshCw /> {t('إعادة المحاولة', 'Try again')}</button>
          </div>
        </div>
      </>
    );
  }

  const firstName = userData.name?.split(' ')[0] || '';
  const activeMeta = PROFILE_TABS.find(tab => tab.id === activeTab);
  const title = activeTab === 'overview'
    ? t(`مرحباً ${firstName} 👋`, `Hi ${firstName} 👋`)
    : t(activeMeta.labelAr, activeMeta.labelEn);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'nutrition': return <NutritionTab onSelectTab={selectTab} />;
      case 'workout':   return <WorkoutTab />;
      case 'chat':      return <ChatTab />;
      case 'payment':   return <PaymentTab userData={userData} />;
      default:          return <OverviewTab userData={userData} onSelectTab={selectTab} onEditProfile={() => setIsEditOpen(true)} />;
    }
  };

  return (
    <>
      {sharedSEO}

      <div className="pf" data-theme={theme} dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
        <ProfileSidebar
          activeTab={activeTab}
          onSelectTab={selectTab}
          unreadCount={unreadCount}
          userData={userData}
          onLogout={handleLogout}
        />

        <main className="pf-main">
          <ProfileTopbar
            title={title}
            userData={userData}
            unreadCount={unreadCount}
            recentMessages={recentMessages}
            onOpenChat={() => selectTab('chat')}
            onEditProfile={() => setIsEditOpen(true)}
            theme={theme}
            onToggleTheme={toggleTheme}
            onLogout={handleLogout}
          />

          <div key={activeTab} className="pf-view">
            {renderTab()}
          </div>
        </main>

        <ProfileBottomNav activeTab={activeTab} onSelectTab={selectTab} unreadCount={unreadCount} />

        {/* Inside .pf so it follows the light/dark theme */}
        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          userData={userData}
          onSave={handleSaveProfile}
        />
      </div>
    </>
  );
};

const Profile = () => (
  <ProfileLanguageProvider>
    <ProfileFeedbackProvider>
      <ProfileContent />
    </ProfileFeedbackProvider>
  </ProfileLanguageProvider>
);

export default Profile;
