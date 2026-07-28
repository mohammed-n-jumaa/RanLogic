import apiClient from './apiClient';

/**
 * Hero Section API
 */
export const heroApi = {
  /**
   * Get hero section for admin panel
   * @returns {Promise}
   */
  async getHeroSection() {
    const response = await apiClient.get('/admin/hero-section');
    return response.data;
  },

  /**
   * Update hero section content
   * @param {Object} data - Content data with English and Arabic
   * @returns {Promise}
   */
  async updateHeroSection(data) {
    const response = await apiClient.put('/admin/hero-section', data);
    return response.data;
  },

  /**
   * Upload hero video
   * @param {File} file - Video file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise}
   */
  async uploadVideo(file, onProgress) {
    const formData = new FormData();
    formData.append('video', file);

    const response = await apiClient.post('/admin/hero-section/video', formData, {
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
   * Delete hero video
   * @returns {Promise}
   */
  async deleteVideo() {
    const response = await apiClient.delete('/admin/hero-section/video');
    return response.data;
  },

  /**
   * Get hero section for public website
   * @param {string} locale - 'ar' or 'en'
   * @returns {Promise}
   */
  async getPublicHeroSection(locale = 'ar') {
    const response = await apiClient.get(`/hero-section/public?locale=${locale}`);
    return response.data;
  },
};

export default heroApi;