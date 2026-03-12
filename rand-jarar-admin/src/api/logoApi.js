import apiClient from './apiClient';

/**
 * Logo API Service
 * Handles all logo-related API calls
 */
const logoApi = {
  
  /**
   * Get the currently active logo
   * Public endpoint - no authentication required
   * 
   * @returns {Promise} Response with active logo data
   */
  getActiveLogo: async () => {
    try {
      const response = await apiClient.get('/logo/active');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'فشل في جلب الشعار',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Upload a new logo
   * Requires authentication
   * 
   * @param {File} file - The logo file to upload
   * @param {Function} onUploadProgress - Optional callback for upload progress
   * @returns {Promise} Response with uploaded logo data
   */
  uploadLogo: async (file, onUploadProgress = null) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('logo', file);

      const response = await apiClient.post('/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress(percentCompleted);
          }
        },
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'فشل في رفع الشعار',
        errors: error.response?.data?.errors,
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Get all logos with pagination
   * Requires authentication
   * 
   * @param {number} page - Page number (default: 1)
   * @param {number} perPage - Items per page (default: 10)
   * @returns {Promise} Response with paginated logos
   */
  getAllLogos: async (page = 1, perPage = 10) => {
    try {
      const response = await apiClient.get('/logos', {
        params: { page, per_page: perPage },
      });

      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        pagination: null,
        message: error.response?.data?.message || 'فشل في جلب الشعارات',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Activate a specific logo
   * Requires authentication
   * 
   * @param {number} logoId - ID of the logo to activate
   * @returns {Promise} Response with activated logo data
   */
  activateLogo: async (logoId) => {
    try {
      const response = await apiClient.patch(`/logo/${logoId}/activate`);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'فشل في تفعيل الشعار',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Delete a logo
   * Requires authentication
   * 
   * @param {number} logoId - ID of the logo to delete
   * @returns {Promise} Response confirming deletion
   */
  deleteLogo: async (logoId) => {
    try {
      const response = await apiClient.delete(`/logo/${logoId}`);

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'فشل في حذف الشعار',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Validate file before upload (client-side validation)
   * 
   * @param {File} file - The file to validate
   * @returns {Object} Validation result
   */
  validateFile: (file) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'svg', 'webp'];

    // Check if file exists
    if (!file) {
      return {
        isValid: false,
        error: 'الرجاء اختيار ملف',
      };
    }

    // Check file size
    if (file.size > MAX_SIZE) {
      return {
        isValid: false,
        error: 'حجم الملف يجب أن لا يتجاوز 5 ميجابايت',
      };
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'نوع الملف غير مدعوم. الصيغ المدعومة: PNG, JPG, JPEG, SVG, WEBP',
      };
    }

    // Check file extension
    const extension = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        isValid: false,
        error: 'امتداد الملف غير صالح',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  },
};

export default logoApi;