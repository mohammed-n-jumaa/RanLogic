import apiClient from './apiClient';

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */
const authApi = {
  
  /**
   * Login user
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Response with user data and token
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      if (response.data.success && response.data.data.token) {
        // Store token in localStorage
        localStorage.setItem('auth_token', response.data.data.token);
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Store authentication status
        localStorage.setItem('isAuthenticated', 'true');
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
        message: error.response?.data?.message || 'فشل تسجيل الدخول',
        errors: error.response?.data?.errors,
      };
    }
  },

  /**
   * Get authenticated user information
   * 
   * @returns {Promise} Response with user data
   */
  me: async () => {
    try {
      const response = await apiClient.get('/auth/me');

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'فشل جلب معلومات المستخدم',
      };
    }
  },

  /**
   * Logout user (current device)
   * 
   * @returns {Promise} Response confirming logout
   */
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');

      // Clear all stored data
      authApi.clearAuthData();

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      // Clear data even if API call fails
      authApi.clearAuthData();
      
      return {
        success: false,
        message: error.response?.data?.message || 'فشل تسجيل الخروج',
      };
    }
  },

  /**
   * Logout from all devices
   * 
   * @returns {Promise} Response confirming logout
   */
  logoutAll: async () => {
    try {
      const response = await apiClient.post('/auth/logout-all');

      // Clear all stored data
      authApi.clearAuthData();

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      // Clear data even if API call fails
      authApi.clearAuthData();
      
      return {
        success: false,
        message: error.response?.data?.message || 'فشل تسجيل الخروج',
      };
    }
  },

  /**
   * Refresh authentication token
   * 
   * @returns {Promise} Response with new token
   */
  refresh: async () => {
    try {
      const response = await apiClient.post('/auth/refresh');

      if (response.data.success && response.data.data.token) {
        // Update token in localStorage
        localStorage.setItem('auth_token', response.data.data.token);
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
        message: error.response?.data?.message || 'فشل تحديث الجلسة',
      };
    }
  },

  /**
   * Check if user is authenticated
   * 
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    const isAuth = localStorage.getItem('isAuthenticated');
    return !!(token && isAuth === 'true');
  },

  /**
   * Get stored user data
   * 
   * @returns {Object|null} User data or null
   */
  getUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  /**
   * Get stored authentication token
   * 
   * @returns {string|null} Token or null
   */
  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  /**
   * Clear all authentication data
   */
  clearAuthData: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  },

  /**
   * Check if user is admin
   * 
   * @returns {boolean} Admin status
   */
  isAdmin: () => {
    const user = authApi.getUser();
    return user?.role === 'admin';
  },
};

export default authApi;
export { authApi };