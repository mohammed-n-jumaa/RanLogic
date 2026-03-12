import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '../components/Profile/ProfileSidebar/ProfileSidebar';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileTabs from '../components/Profile/ProfileTabs';
import OverviewTab from '../components/Profile/OverviewTab';
import NutritionTab from '../components/Profile/NutritionTab';
import WorkoutTab from '../components/Profile/WorkoutTab';
import ChatTab from '../components/Profile/ChatTab';
import PaymentTab from '../components/Profile/PaymentTab';
import LanguageToggle from '../components/Profile/LanguageToggle/LanguageToggle';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import SEO from '../components/SEO/SEO';
import { ProfileLanguageProvider } from '../contexts/ProfileLanguageContext';
import { useLanguage } from '../contexts/LanguageContext';
import { pagesSEO, breadcrumbs } from '../utils/seoConfig';
import profileApi from '../api/profileApi';
import authApi from '../api/authApi';
import Swal from 'sweetalert2';
import './Profile.scss';

const ProfileContent = () => {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const seoData = pagesSEO.profile[currentLang];

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      // Check if user is authenticated
      const user = authApi.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Fetch profile data
      await fetchProfileData();
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

  const handleProfileUpdate = async (updatedData) => {
    try {
      console.log('📝 Profile-Clean received updatedData:', JSON.stringify(updatedData, null, 2));
      
      const updatePayload = {
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone || '',
        height: updatedData.height,
        weight: updatedData.weight,
        waist: updatedData.waist,
        hips: updatedData.hips || null,
        age: updatedData.age,
        gender: updatedData.gender,
        goal: updatedData.goal,
        workout_place: updatedData.workout_place,
        health_notes: updatedData.health_notes || '',
        avatar: updatedData.avatar
      };

      // ✅ إضافة كلمة المرور إلى الـ payload بدلاً من استدعاء منفصل
      if (updatedData.password && updatedData.password.trim() !== '') {
        console.log('🔐 Password fields found:', {
          password: updatedData.password ? 'EXISTS' : 'MISSING',
          password_confirmation: updatedData.password_confirmation ? 'EXISTS' : 'MISSING',
          current_password: updatedData.current_password ? 'EXISTS' : 'MISSING'
        });
        
        updatePayload.password = updatedData.password;
        updatePayload.password_confirmation = updatedData.password_confirmation;
        updatePayload.current_password = updatedData.current_password || '';
      }

      console.log('📤 Final payload to send:', JSON.stringify(updatePayload, null, 2));

      // ✅ استدعاء updateProfile مرة واحدة فقط
      const response = await profileApi.updateProfile(updatePayload);
      
      console.log('✅ Response from server:', response);
      
      if (response.success) {
        // Update local user data
        setUserData(prev => ({
          ...prev,
          ...response.data
        }));

        // Update user in localStorage
        const currentUser = authApi.getUser();
        const updatedUser = {
          ...currentUser,
          ...response.data
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        return response.data;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('❌ Error in handleProfileUpdate:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <>
        <SEO
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          image={seoData.ogImage}
          lang={currentLang}
          breadcrumbItems={breadcrumbs.profile(currentLang)}
          noindex={true} // Profile pages should not be indexed
        />
        
        <div className="profile-page loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>جاري تحميل الملف الشخصي...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !userData) {
    return (
      <>
        <SEO
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          image={seoData.ogImage}
          lang={currentLang}
          breadcrumbItems={breadcrumbs.profile(currentLang)}
          noindex={true}
        />
        
        <div className="profile-page error">
          <div className="error-message">
            <h2>حدث خطأ</h2>
            <p>{error || 'فشل في تحميل البيانات'}</p>
            <button onClick={fetchProfileData} className="retry-btn">
              إعادة المحاولة
            </button>
          </div>
        </div>
      </>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab userData={userData} />;
      case 'nutrition':
        return <NutritionTab />;
      case 'workout':
        return <WorkoutTab />;
      case 'chat':
        return <ChatTab />;
      case 'payment':
        return <PaymentTab userData={userData} />;
      default:
        return <OverviewTab userData={userData} />;
    }
  };

  return (
    <>
      <SEO
        title={`${userData.name} - ${seoData.title}`}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.ogImage}
        lang={currentLang}
        breadcrumbItems={breadcrumbs.profile(currentLang)}
        noindex={true} // Profile pages should not be indexed
        nofollow={true}
      />

      <div className="profile-page">
        <ProfileSidebar />
        <LanguageToggle />
        
        <ProfileHeader 
          userData={userData} 
          onProfileUpdate={handleProfileUpdate}
        />
        
        <ProfileTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
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

const Profile = () => {
  return (
    <ProfileLanguageProvider>
      <ProfileContent />
    </ProfileLanguageProvider>
  );
};

export default Profile;