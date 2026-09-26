import apiClient from './apiClient';

export const testimonialsApi = {
  async getAll() {
    const response = await apiClient.get('/admin/testimonials');
    return response.data;
  },

  async updateAll(data) {
    const response = await apiClient.post('/admin/testimonials/update-all', data);
    return response.data;
  },

  async uploadImage(id, file) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post(`/admin/testimonials/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deleteImage(id) {
    const response = await apiClient.delete(`/admin/testimonials/${id}/image`);
    return response.data;
  },

  async getPublicTestimonials(locale = 'ar') {
    const response = await apiClient.get(`/testimonials/public?locale=${locale}`);
    return response.data;
  },

  async updateDesignType(designType) {
    const response = await apiClient.put('/admin/testimonials/design-type', {
      design_type: designType,
    });
    return response.data;
  },
};

export default testimonialsApi;
