import apiClient from './apiClient';

/**
 * About Coach API
 */
export const aboutCoachApi = {
  /**
   * Get about coach data for admin
   * @returns {Promise}
   */
  async getAboutCoach() {
    const response = await apiClient.get('/admin/about-coach');
    return response.data;
  },

  /**
   * Update about coach content
   * @param {Object} data - Content data with features
   * @returns {Promise}
   */
  async updateAboutCoach(data) {
    const response = await apiClient.put('/admin/about-coach', data);
    return response.data;
  },

  /**
   * Upload coach image
   * @param {File} file - Image file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise}
   */
  async uploadImage(file, onProgress) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/admin/about-coach/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) {
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  /**
   * Delete coach image
   * @returns {Promise}
   */
  async deleteImage() {
    const response = await apiClient.delete('/admin/about-coach/image');
    return response.data;
  },

  /**
   * Get about coach for public website
   * @param {string} locale - 'ar' or 'en'
   * @returns {Promise}
   */
  async getPublicAboutCoach(locale = 'ar') {
    const response = await apiClient.get(`/about-coach/public?locale=${locale}`);
    return response.data;
  },
};

export default aboutCoachApi;