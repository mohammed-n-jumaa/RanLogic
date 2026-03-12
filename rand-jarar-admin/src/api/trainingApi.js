import apiClient from './apiClient';

const trainingApi = {
  // Get all trainees
  getAllTrainees: () => {
    return apiClient.get('/admin/training/trainees');
  },

  // Get trainee details
  getTraineeDetails: (id, year, month) => {
    return apiClient.get(`/admin/training/trainees/${id}`, {
      params: { year, month }
    });
  },

  // Get trainee by ID
  getTraineeById: (id) => {
    return apiClient.get(`/admin/training/trainees/${id}`);
  },

  // Create trainee with FormData
  createTrainee: (formData) => {
    console.log('API: Creating trainee with FormData');
    
    // Log FormData contents
    if (formData instanceof FormData) {
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, ':', value.name, `(${value.size} bytes, ${value.type})`);
        } else {
          console.log(key, ':', value);
        }
      }
    }
    
    return apiClient.post('/admin/training/trainees', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update trainee with FormData
  updateTrainee: (id, formData) => {
    console.log(`API: Updating trainee ${id} with FormData`);
    
    // Log FormData contents
    if (formData instanceof FormData) {
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, ':', value.name, `(${value.size} bytes, ${value.type})`);
        } else {
          console.log(key, ':', value);
        }
      }
    }
    
    // Use POST with _method=PUT for FormData compatibility with Laravel
    return apiClient.post(`/admin/training/trainees/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete trainee
  deleteTrainee: (id) => {
    return apiClient.delete(`/admin/training/trainees/${id}`);
  },

  // Save nutrition plan with FormData
  saveNutritionPlan: (userId, formData) => {
    console.log(`API: Saving nutrition plan for user ${userId}`);
    
    // Log FormData contents
    if (formData instanceof FormData) {
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, ':', value.name, `(${value.size} bytes, ${value.type})`);
        } else {
          console.log(key, ':', value);
        }
      }
    }
    
    return apiClient.post(`/admin/training/trainees/${userId}/nutrition`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Save workout plan with FormData
  saveWorkoutPlan: (userId, formData) => {
    console.log(`API: Saving workout plan for user ${userId}`);
    
    // Log FormData contents
    if (formData instanceof FormData) {
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, ':', value.name, `(${value.size} bytes, ${value.type})`);
        } else {
          console.log(key, ':', value);
        }
      }
    }
    
    return apiClient.post(`/admin/training/trainees/${userId}/workout`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Toggle meal item completion
  toggleMealItem: (itemId) => {
    return apiClient.post(`/admin/training/nutrition/items/${itemId}/toggle`);
  },

  // Toggle exercise completion
  toggleExercise: (exerciseId) => {
    return apiClient.post(`/admin/training/workout/exercises/${exerciseId}/toggle`);
  },

  // Delete meal
  deleteMeal: (mealId) => {
    return apiClient.delete(`/admin/training/nutrition/meals/${mealId}`);
  },

  // Delete exercise
  deleteExercise: (exerciseId) => {
    return apiClient.delete(`/admin/training/workout/exercises/${exerciseId}`);
  },

  // Get progress stats
  getProgress: (userId, year, month) => {
    return apiClient.get(`/admin/training/trainees/${userId}/progress`, {
      params: { year, month }
    });
  },
};

export default trainingApi;