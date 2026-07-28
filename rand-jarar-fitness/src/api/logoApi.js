import api from './index';

const logoApi = {
  // جلب الشعار النشط
  getActiveLogo: async () => {
    try {
      const response = await api.get('/logo/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active logo:', error);
      throw error;
    }
  },

  // جلب جميع الشعارات (للوحة الإدارة)
  getAllLogos: async (perPage = 10) => {
    try {
      const response = await api.get('/logos', {
        params: { per_page: perPage }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching logos:', error);
      throw error;
    }
  },

  // رفع شعار جديد
  uploadLogo: async (file) => {
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await api.post('/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  },

  // تفعيل شعار معين
  activateLogo: async (id) => {
    try {
      const response = await api.patch(`/logo/${id}/activate`);
      return response.data;
    } catch (error) {
      console.error('Error activating logo:', error);
      throw error;
    }
  },

  // حذف شعار
  deleteLogo: async (id) => {
    try {
      const response = await api.delete(`/logo/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting logo:', error);
      throw error;
    }
  }
};

export default logoApi;