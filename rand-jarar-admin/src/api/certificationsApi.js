import apiClient from './apiClient';

/**
 * Certifications API
 */
export const certificationsApi = {
  /**
   * Get all certifications for admin
   * @returns {Promise}
   */
  async getAllCertifications() {
    const response = await apiClient.get('/admin/certifications');
    return response.data;
  },

  /**
   * Create new certification
   * @param {Object} data - Certification data
   * @returns {Promise}
   */
  async createCertification(data) {
    const response = await apiClient.post('/admin/certifications', data);
    return response.data;
  },

  /**
   * Update certification
   * @param {number} id - Certification ID
   * @param {Object} data - Updated data
   * @returns {Promise}
   */
  async updateCertification(id, data) {
    const response = await apiClient.put(`/admin/certifications/${id}`, data);
    return response.data;
  },

  /**
   * Delete certification
   * @param {number} id - Certification ID
   * @returns {Promise}
   */
  async deleteCertification(id) {
    const response = await apiClient.delete(`/admin/certifications/${id}`);
    return response.data;
  },

  /**
   * Reorder certifications
   * @param {Array} order - Array of certification IDs in new order
   * @returns {Promise}
   */
  async reorderCertifications(order) {
    const response = await apiClient.post('/admin/certifications/reorder', { order });
    return response.data;
  },

  /**
   * Bulk update certifications
   * @param {Array} certifications - Array of certification objects
   * @returns {Promise}
   */
  async bulkUpdateCertifications(certifications) {
    const response = await apiClient.post('/admin/certifications/bulk-update', {
      certifications,
    });
    return response.data;
  },

  /**
   * Get active certifications for public website
   * @param {string} locale - 'ar' or 'en'
   * @returns {Promise}
   */
  async getPublicCertifications(locale = 'ar') {
    const response = await apiClient.get(`/certifications/public?locale=${locale}`);
    return response.data;
  },
};

export default certificationsApi;