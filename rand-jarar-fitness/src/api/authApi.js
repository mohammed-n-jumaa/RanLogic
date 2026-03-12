import api from './index';

const authApi = {
  /**
   * تسجيل دخول المستخدم
   */
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
        
        // تعيين وقت آخر نشاط
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

  /**
   * تسجيل مستخدم جديد
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);

      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('is_authenticated', 'true');
        
        // تعيين وقت آخر نشاط
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

  /**
   * جلب معلومات المستخدم الحالي (من السيرفر)
   */
  me: async () => {
    try {
      const response = await api.get('/auth/me');
      
      // تحديث وقت آخر نشاط بعد طلب ناجح
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

  /**
   * ✅ حفظ بيانات المستخدم في localStorage بشكل موحّد
   */
  setUser: (user) => {
    if (!user) return;
    localStorage.setItem('user', JSON.stringify(user));

    // لو عندك لغة ضمن user
    if (user?.language) {
      localStorage.setItem('language', user.language);
    }
  },

  /**
   * ✅ تحديث بيانات المستخدم من السيرفر ثم تخزينها
   * ترجع: { success, data: user }
   */
  refreshUser: async () => {
    const res = await authApi.me();
    if (res?.success && res?.data) {
      authApi.setUser(res.data);
      return { success: true, data: res.data };
    }
    return { success: false, message: res?.message || 'فشل تحديث بيانات المستخدم' };
  },

  /**
   * تسجيل خروج (جهاز واحد)
   */
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

  /**
   * تسجيل خروج من جميع الأجهزة
   */
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

  /**
   * تحديث التوكن
   */
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

  /**
   * التحقق من حالة المصادقة
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    const isAuth = localStorage.getItem('is_authenticated');
    return !!(token && isAuth === 'true');
  },

  /**
   * جلب بيانات المستخدم المخزنة
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
   * جلب التوكن المخزن
   */
  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  /**
   * مسح بيانات المصادقة
   */
  clearAuthData: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('is_authenticated');
    localStorage.removeItem('last_activity');
  },

  /**
   * التحقق إذا كان المستخدم مدير
   */
  isAdmin: () => {
    const user = authApi.getUser();
    return user?.role === 'admin';
  },

  /**
   * التحقق إذا كان المستخدم مشترك
   */
  hasActiveSubscription: () => {
    const user = authApi.getUser();
    return user?.has_active_subscription === true;
  },

  /**
   * تحديث وقت آخر نشاط
   */
  updateLastActivity: () => {
    if (authApi.isAuthenticated()) {
      localStorage.setItem('last_activity', Date.now().toString());
    }
  },

  /**
   * الحصول على وقت آخر نشاط
   */
  getLastActivity: () => {
    const lastActivity = localStorage.getItem('last_activity');
    return lastActivity ? parseInt(lastActivity) : null;
  },

  /**
   * التحقق من صلاحية الجلسة بناءً على آخر نشاط
   */
  isSessionValid: (timeoutMinutes = 30) => {
    if (!authApi.isAuthenticated()) return false;

    const lastActivity = authApi.getLastActivity();
    
    if (!lastActivity) {
      // إذا لم يكن هناك سجل للنشاط، احفظ الوقت الحالي
      authApi.updateLastActivity();
      return true;
    }

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;
    const timeoutDuration = timeoutMinutes * 60 * 1000;

    return timeSinceLastActivity <= timeoutDuration;
  },

  /**
   * الحصول على الوقت المتبقي للجلسة بالدقائق
   */
  getRemainingSessionTime: (timeoutMinutes = 30) => {
    if (!authApi.isAuthenticated()) return 0;

    const lastActivity = authApi.getLastActivity();
    if (!lastActivity) return timeoutMinutes;

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;
    const timeoutDuration = timeoutMinutes * 60 * 1000;
    const remainingTime = timeoutDuration - timeSinceLastActivity;

    return Math.max(0, Math.floor(remainingTime / 60000)); // تحويل لدقائق
  },
};

export default authApi;