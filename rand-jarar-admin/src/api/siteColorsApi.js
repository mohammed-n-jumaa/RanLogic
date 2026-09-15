import apiClient from './apiClient';

const siteColorsApi = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/site-colors');
      return res.data;
    } catch (error) {
      console.error('Error fetching site colors:', error);
      return { success: false, data: {} };
    }
  },

  update: async (colors) => {
    const res = await apiClient.put('/admin/site-colors', { colors });
    return res.data;
  },

  reset: async () => {
    const res = await apiClient.post('/admin/site-colors/reset');
    return res.data;
  },
};

export default siteColorsApi;
