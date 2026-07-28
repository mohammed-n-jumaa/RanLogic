import api from './index';

const profileApi = {
  /**
   * Get current user's profile
   */
  getMyProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

/**
 * Update profile information
 */
updateProfile: async (profileData) => {
  try {
    console.log('🔍 profileApi.updateProfile received:', JSON.stringify(profileData, null, 2));
    
    // ✅ فصل تحديث كلمة المرور عن البيانات الأخرى
    let passwordUpdateResult = null;
    
    if (profileData.password && profileData.password.trim() !== '') {
      console.log('🔐 Password update branch entered');
      
      // ✅ البحث عن حقل التأكيد
      const confirmPassword = profileData.password_confirmation || 
                             profileData.confirmPassword || 
                             profileData.confirm_password;
      
      console.log('🔐 Extracted confirmPassword:', confirmPassword ? 'EXISTS' : 'MISSING');
      
      if (!confirmPassword) {
        console.error('❌ No confirmPassword found!');
        throw new Error('تأكيد كلمة المرور مطلوب');
      }
      
      console.log('🔐 Calling updatePassword...');
      
      // تحديث كلمة المرور بشكل منفصل
      passwordUpdateResult = await profileApi.updatePassword(
        profileData.current_password || '',
        profileData.password,
        confirmPassword
      );
      
      console.log('✅ Password update result:', passwordUpdateResult);
      
      // إذا فشل تحديث كلمة المرور، ارمِ الخطأ
      if (!passwordUpdateResult.success) {
        throw new Error(passwordUpdateResult.message || 'فشل تحديث كلمة المرور');
      }
    }
    
    // إزالة حقول كلمة المرور من البيانات
    const cleanedData = { ...profileData };
    delete cleanedData.password;
    delete cleanedData.password_confirmation;
    delete cleanedData.confirmPassword;
    delete cleanedData.confirm_password;
    delete cleanedData.current_password;
    
    console.log('📤 Cleaned data for profile update:', cleanedData);
    
    // إذا كان هناك صورة base64، أرسلها في حقل photo
    if (cleanedData.avatar && typeof cleanedData.avatar === 'string' && cleanedData.avatar.startsWith('data:image')) {
      const payload = {
        ...cleanedData,
        photo: cleanedData.avatar
      };
      delete payload.avatar;
      
      console.log('📸 Sending with photo');
      const response = await api.put('/profile', payload);
      return response.data;
    }
    
    // إذا لم يكن هناك صورة، أرسل البيانات العادية فقط
    const payload = { ...cleanedData };
    delete payload.avatar;
    
    console.log('📝 Sending profile update without photo');
    const response = await api.put('/profile', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Error in profileApi.updateProfile:', error);
    console.error('❌ Error response:', error.response?.data);
    throw error;
  }
},
  /**
   * Update password
   */
  updatePassword: async (currentPassword, newPassword, confirmPassword) => {
    try {
      const payload = {
        current_password: currentPassword || '',
        new_password: newPassword,
        confirm_password: confirmPassword
      };
      
      console.log('🔐 Password update payload:', payload);
      
      const response = await api.put('/profile/password', payload);
      return response.data;
    } catch (error) {
      console.error('Error updating password:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Upload profile photo separately (if needed)
   */
  uploadPhoto: async (photoBase64OrFile) => {
    try {
      // إذا كانت base64
      if (typeof photoBase64OrFile === 'string') {
        const response = await api.post('/profile/photo', {
          photo: photoBase64OrFile
        });
        return response.data;
      }
      
      // إذا كان File object
      const formData = new FormData();
      formData.append('avatar', photoBase64OrFile);
      
      const response = await api.post('/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  },

  /**
   * Delete profile photo
   */
  deletePhoto: async () => {
    try {
      const response = await api.delete('/profile/photo');
      return response.data;
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  },

  /**
 * Get nutrition plan for specific month
 */
getMyNutritionPlan: async (year = null, month = null) => {
  try {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;
    
    const response = await api.get('/trainee/nutrition-plan', { params });
    
    console.log('🍎 Nutrition Plan API Response:', response.data);
    
    // ✅ Return the response as-is (already has .success and .data)
    return response.data;
  } catch (error) {
    console.error('Error fetching nutrition plan:', error);
    throw error;
  }
},

  /**
   * Toggle meal item completion
   */
  toggleMealItem: async (itemId) => {
    try {
      const response = await api.post(`/trainee/nutrition/items/${itemId}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error toggling meal item:', error);
      throw error;
    }
  },

 
/**
 * Get nutrition plan for specific month
 */
getMyNutritionPlan: async (year = null, month = null) => {
  try {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;
    
    console.log('🔍 Fetching nutrition plan with params:', params);
    
    const response = await api.get('/trainee/nutrition-plan', { params });
    
    console.log('🍎 Nutrition Plan FULL Response:', response);
    console.log('🍎 Nutrition Plan response.data:', response.data);
    console.log('🍎 Nutrition Plan response.data.success:', response.data?.success);
    console.log('🍎 Nutrition Plan response.data.data:', response.data?.data);
    
    if (response.data?.data?.meals) {
      console.log('🍎 Number of meals:', response.data.data.meals.length);
      console.log('🍎 First meal:', response.data.data.meals[0]);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching nutrition plan:', error);
    console.error('❌ Error response:', error.response);
    throw error;
  }
},

/**
 * Get workout plan for specific month
 */
getMyWorkoutPlan: async (year = null, month = null) => {
  try {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;
    
    console.log('🔍 Fetching workout plan with params:', params);
    
    const response = await api.get('/trainee/workout-plan', { params });
    
    console.log('💪 Workout Plan FULL Response:', response);
    console.log('💪 Workout Plan response.data:', response.data);
    console.log('💪 Workout Plan response.data.success:', response.data?.success);
    console.log('💪 Workout Plan response.data.data:', response.data?.data);
    
    if (response.data?.data?.exercises) {
      console.log('💪 Number of exercises:', response.data.data.exercises.length);
      console.log('💪 First exercise:', response.data.data.exercises[0]);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching workout plan:', error);
    console.error('❌ Error response:', error.response);
    throw error;
  }
},

  /**
   * Toggle exercise completion
   */
  toggleExercise: async (exerciseId) => {
    try {
      const response = await api.post(`/trainee/workout/exercises/${exerciseId}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error toggling exercise:', error);
      throw error;
    }
  },

  /**
   * Get today's stats
   */
  getTodayStats: async () => {
    try {
      const now = new Date();
      const response = await api.get(`/trainee/progress`, {
        params: {
          year: now.getFullYear(),
          month: now.getMonth() + 1
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching today stats:', error);
      throw error;
    }
  }
};

export default profileApi;