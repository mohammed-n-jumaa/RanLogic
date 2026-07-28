import apiClient from './apiClient';

/**
 * Testimonials API
 */
export const testimonialsApi = {
  /**
   * Get all testimonials and section for admin
   * @returns {Promise}
   */
  async getAll() {
    const response = await apiClient.get('/admin/testimonials');
    return response.data;
  },

  /**
   * Update section and testimonials (bulk update)
   * @param {Object} data - Section and testimonials data
   * @returns {Promise}
   */
  async updateAll(data) {
    const response = await apiClient.post('/admin/testimonials/update-all', data);
    return response.data;
  },

  /**
   * Upload testimonial image
   * @param {number} id - Testimonial ID
   * @param {File} file - Image file
   * @returns {Promise}
   */
  async uploadImage(id, file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post(`/admin/testimonials/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Delete testimonial image
   * @param {number} id - Testimonial ID
   * @returns {Promise}
   */
  async deleteImage(id) {
    const response = await apiClient.delete(`/admin/testimonials/${id}/image`);
    return response.data;
  },

  /**
   * Get testimonials for public website
   * @param {string} locale - 'ar' or 'en'
   * @returns {Promise}
   */
  async getPublicTestimonials(locale = 'ar') {
    const response = await apiClient.get(`/testimonials/public?locale=${locale}`);
    return response.data;
  },
};

export default testimonialsApi;