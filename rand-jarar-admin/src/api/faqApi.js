import apiClient from './apiClient';

/**
 * FAQ API
 */
export const faqApi = {
  /**
   * Get all FAQ data for admin
   * @returns {Promise}
   */
  async getAll() {
    const response = await apiClient.get('/admin/faq');
    return response.data;
  },

  /**
   * Update all FAQ data (section + questions)
   * @param {Object} data - Section and questions data
   * @returns {Promise}
   */
  async updateAll(data) {
    const response = await apiClient.post('/admin/faq/update-all', data);
    return response.data;
  },

  /**
   * Mark user question as read
   * @param {number} id - Question ID
   * @returns {Promise}
   */
  async markAsRead(id) {
    const response = await apiClient.post(`/admin/faq/user-questions/${id}/mark-read`);
    return response.data;
  },

  /**
   * Mark user question as unread
   * @param {number} id - Question ID
   * @returns {Promise}
   */
  async markAsUnread(id) {
    const response = await apiClient.post(`/admin/faq/user-questions/${id}/mark-unread`);
    return response.data;
  },

  /**
   * Delete user question
   * @param {number} id - Question ID
   * @returns {Promise}
   */
  async deleteUserQuestion(id) {
    const response = await apiClient.delete(`/admin/faq/user-questions/${id}`);
    return response.data;
  },

  /**
   * Get FAQ for public website
   * @param {string} locale - 'ar' or 'en'
   * @returns {Promise}
   */
  async getPublicFaq(locale = 'ar') {
    const response = await apiClient.get(`/faq/public?locale=${locale}`);
    return response.data;
  },

  /**
   * Submit user question (from public form)
   * @param {Object} data - {name, email, question}
   * @returns {Promise}
   */
  async submitUserQuestion(data) {
    const response = await apiClient.post('/faq/user-question', data);
    return response.data;
  },
};

export default faqApi;