import apiClient from './apiClient';

const exerciseLibraryApi = {
  /**
   * Get all exercises with optional search/filter/sort/pagination
   * @param {Object} params - { search, exercise_date, sets, reps, sort, per_page, page }
   */
  getAll: (params = {}) => {
    return apiClient.get('/admin/training/exercise-library', { params });
  },

  /**
   * Get quick stats
   */
  getStats: () => {
    return apiClient.get('/admin/training/exercise-library/stats');
  },

  /**
   * Get single exercise by ID
   */
  getById: (id) => {
    return apiClient.get(`/admin/training/exercise-library/${id}`);
  },

  /**
   * Create new exercise
   * @param {FormData} formData
   */
  create: (formData) => {
    return apiClient.post('/admin/training/exercise-library', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Update exercise
   * @param {number} id
   * @param {FormData} formData
   */
  update: (id, formData) => {
    return apiClient.post(`/admin/training/exercise-library/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Delete exercise
   */
  delete: (id) => {
    return apiClient.delete(`/admin/training/exercise-library/${id}`);
  },
};

export default exerciseLibraryApi;