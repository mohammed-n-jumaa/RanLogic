import apiClient from './apiClient';

/**
 * Profile API Service
 * Handles all profile-related API calls
 */
const profileApi = {
  
  /**
   * Get authenticated user profile
   * 
   * @returns {Promise} Response with user profile data
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/profile');

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'فشل جلب بيانات الملف الشخصي',
      };
    }
  },

  /**
   * Update profile information
   * 
   * @param {Object} data - Profile data (name, email, phone)
   * @returns {Promise} Response with updated profile data
   */
  updateProfile: async (data) => {
    try {
      const response = await apiClient.put('/profile', {
        name: data.name,
        email: data.email,
        phone: data.phone,
      });

      // Update user data in localStorage
      if (response.data.success && response.data.data) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...response.data.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'فشل تحديث البيانات',
        errors: error.response?.data?.errors,
      };
    }
  },

  /**
   * Update password
   * 
   * @param {Object} data - Password data (current_password, new_password, confirm_password)
   * @returns {Promise} Response confirming password update
   */
  updatePassword: async (data) => {
    try {
      const response = await apiClient.put('/profile/password', {
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'فشل تحديث كلمة المرور',
        errors: error.response?.data?.errors,
      };
    }
  },

  /**
   * Upload profile photo
   * 
   * @param {string} photoBase64 - Base64 encoded image
   * @returns {Promise} Response with updated avatar URL
   */
  uploadPhoto: async (photoBase64) => {
    try {
      const response = await apiClient.post('/profile/photo', {
        photo: photoBase64,
      });

      // Update user avatar in localStorage
      if (response.data.success && response.data.data.avatar_url) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.avatar_url = response.data.data.avatar_url;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'فشل رفع الصورة',
        errors: error.response?.data?.errors,
      };
    }
  },

  /**
   * Delete profile photo
   * 
   * @returns {Promise} Response confirming photo deletion
   */
  deletePhoto: async () => {
    try {
      const response = await apiClient.delete('/profile/photo');

      // Update user avatar in localStorage to default
      if (response.data.success && response.data.data.avatar_url) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.avatar_url = response.data.data.avatar_url;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'فشل حذف الصورة',
      };
    }
  },
};

export default profileApi;