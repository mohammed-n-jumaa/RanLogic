import api from './index';

const authApi = {
 

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('is_authenticated', 'true');
        
        authApi.updateLastActivity();

        if (response.data.data.user?.language) {
          localStorage.setItem('language', response.data.data.user.language);
        }
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'فشل تسجيل الدخول',
        errors: error.response?.data?.errors,
      };
    }
  },

 
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);

      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('is_authenticated', 'true');
        
        authApi.updateLastActivity();

        if (response.data.data.user?.language) {
          localStorage.setItem('language', response.data.data.user.language);
        }
      }

      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'فشل إنشاء الحساب',
        errors: error.response?.data?.errors,
      };
    }
  },

 
  me: async () => {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        authApi.updateLastActivity();
      }
      
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'فشل جلب معلومات المستخدم',
      };
    }
  },

  
  setUser: (user) => {
    if (!user) return;
    localStorage.setItem('user', JSON.stringify(user));

    if (user?.language) {
      localStorage.setItem('language', user.language);
    }
  },

 
  refreshUser: async () => {
    const res = await authApi.me();
    if (res?.success && res?.data) {
      authApi.setUser(res.data);
      return { success: true, data: res.data };
    }
    return { success: false, message: res?.message || 'فشل تحديث بيانات المستخدم' };
  },

 
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      authApi.clearAuthData();
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      authApi.clearAuthData();
      return {
        success: false,
        message: error.response?.data?.message || 'فشل تسجيل الخروج',
      };
    }
  },

 
  logoutAll: async () => {
    try {
      const response = await api.post('/auth/logout-all');
      authApi.clearAuthData();
      return response.data;
    } catch (error) {
      console.error('Logout all error:', error);
      authApi.clearAuthData();
      return {
        success: false,
        message: error.response?.data?.message || 'فشل تسجيل الخروج',
      };
    }
  },


  refresh: async () => {
    try {
      const response = await api.post('/auth/refresh');

      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        authApi.updateLastActivity();
      }

      return response.data;
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'فشل تحديث الجلسة',
      };
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    const isAuth = localStorage.getItem('is_authenticated');
    return !!(token && isAuth === 'true');
  },

 
  getUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  
  getToken: () => {
    return localStorage.getItem('auth_token');
  },

 
  clearAuthData: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('is_authenticated');
    localStorage.removeItem('last_activity');
  },

  
  isAdmin: () => {
    const user = authApi.getUser();
    return user?.role === 'admin';
  },

 
  hasActiveSubscription: () => {
    const user = authApi.getUser();
    return user?.has_active_subscription === true;
  },

 
  updateLastActivity: () => {
    if (authApi.isAuthenticated()) {
      localStorage.setItem('last_activity', Date.now().toString());
    }
  },

 
  getLastActivity: () => {
    const lastActivity = localStorage.getItem('last_activity');
    return lastActivity ? parseInt(lastActivity) : null;
  },

 
  isSessionValid: (timeoutMinutes = 30) => {
    if (!authApi.isAuthenticated()) return false;

    const lastActivity = authApi.getLastActivity();
    
    if (!lastActivity) {

      authApi.updateLastActivity();
      return true;
    }

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;
    const timeoutDuration = timeoutMinutes * 60 * 1000;

    return timeSinceLastActivity <= timeoutDuration;
  },

  
  getRemainingSessionTime: (timeoutMinutes = 30) => {
    if (!authApi.isAuthenticated()) return 0;

    const lastActivity = authApi.getLastActivity();
    if (!lastActivity) return timeoutMinutes;

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;
    const timeoutDuration = timeoutMinutes * 60 * 1000;
    const remainingTime = timeoutDuration - timeSinceLastActivity;

    return Math.max(0, Math.floor(remainingTime / 60000)); 
  },
};

export default authApi;