import React, { useState, useEffect } from 'react';
import { 
  UserCircle, 
  Shield, 
  Camera,
  Save,
  CheckCircle,
  X
} from 'lucide-react';
import ProfileInfo from '../../components/Profile/ProfileInfo/ProfileInfo';
import SecuritySettings from '../../components/Profile/SecuritySettings/SecuritySettings';
import ProfilePhotoUpload from '../../components/Profile/ProfilePhotoUpload/ProfilePhotoUpload';
import SuccessMessage from '../../components/Profile/SuccessMessage/SuccessMessage';
import profileApi from '../../api/profileApi';
import authApi from '../../api/authApi';
import './Profile.scss';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    const user = authApi.getUser();
    if (user) {
      setProfileData(user);
    } else {
      // Fetch from API if not in localStorage
      const response = await profileApi.getProfile();
      if (response.success) {
        setProfileData(response.data);
      }
    }
  };

  const handleSaveProfile = async (data) => {
    setIsLoading(true);
    setError('');

    const response = await profileApi.updateProfile(data);
    
    setIsLoading(false);

    if (response.success) {
      setProfileData(response.data);
      showSuccessMsg('تم حفظ البيانات بنجاح');
    } else {
      setError(response.message);
    }
  };

  const handleSaveSecurity = async (data) => {
    setIsLoading(true);
    setError('');

    const response = await profileApi.updatePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
    
    setIsLoading(false);

    if (response.success) {
      showSuccessMsg('تم تحديث كلمة المرور بنجاح');
    } else {
      setError(response.message);
    }
  };

  const handleUploadPhoto = async (photoBase64) => {
    setIsLoading(true);
    setError('');

    const response = await profileApi.uploadPhoto(photoBase64);
    
    setIsLoading(false);

    if (response.success) {
      // Update profile data with new avatar
      setProfileData(prev => ({
        ...prev,
        avatar_url: response.data.avatar_url
      }));
      showSuccessMsg('تم حفظ الصورة بنجاح');
    } else {
      setError(response.message);
    }
  };

  const showSuccessMsg = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSuccessMessage('');
  };

  if (!profileData) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <UserCircle size={28} />
            <div className="header-text">
              <h1>الملف الشخصي</h1>
              <p>إدارة معلوماتك الشخصية وإعدادات الحساب</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <UserCircle size={18} />
            <span>البيانات</span>
          </button>
          <button
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} />
            <span>الأمان</span>
          </button>
          <button
            className={`tab ${activeTab === 'photo' ? 'active' : ''}`}
            onClick={() => setActiveTab('photo')}
          >
            <Camera size={18} />
            <span>الصورة</span>
          </button>
        </div>

        {/* Content */}
        <div className="profile-content">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <ProfileInfo 
              userData={profileData}
              onSave={handleSaveProfile}
              isLoading={isLoading}
            />
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <SecuritySettings 
              onSave={handleSaveSecurity}
              isLoading={isLoading}
            />
          )}

          {/* Photo Tab */}
          {activeTab === 'photo' && (
            <ProfilePhotoUpload 
              currentPhoto={profileData.avatar_url}
              onUpload={handleUploadPhoto}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <X size={20} />
            <span>{error}</span>
            <button onClick={() => setError('')}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Success Message */}
        <SuccessMessage 
          message={successMessage}
          isVisible={showSuccess}
          onClose={handleCloseSuccess}
        />
      </div>
    </div>
  );
};

export default Profile;