// trainingApi.js
import apiClient from './apiClient';

const trainingApi = {
  getAllTrainees: () => {
    return apiClient.get('/admin/training/trainees');
  },

  getTraineeDetails: (id, year, month) => {
    return apiClient.get(`/admin/training/trainees/${id}`, {
      params: { year, month }
    });
  },

  getTraineeById: (id) => {
    return apiClient.get(`/admin/training/trainees/${id}`);
  },

  createTrainee: (formData) => {
    console.log('API: Creating trainee with FormData');
    
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

  updateTrainee: (id, formData) => {
    console.log(`API: Updating trainee ${id} with FormData`);
    
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
    
    return apiClient.post(`/admin/training/trainees/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteTrainee: (id) => {
    return apiClient.delete(`/admin/training/trainees/${id}`);
  },

  saveNutritionPlan: (userId, formData) => {
    console.log(`API: Saving nutrition plan for user ${userId}`);
    
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

  saveWorkoutPlan: (userId, formData) => {
    console.log(`API: Saving workout plan for user ${userId}`);
    
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

  importWorkoutExcel: (userId, formData) => {
    console.log(`API: Importing workout Excel for user ${userId}`);
    
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
    
    return apiClient.post(`/admin/training/trainees/${userId}/workout/import-excel`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  toggleMealItem: (itemId) => {
    return apiClient.post(`/admin/training/nutrition/items/${itemId}/toggle`);
  },

  toggleExercise: (exerciseId) => {
    return apiClient.post(`/admin/training/workout/exercises/${exerciseId}/toggle`);
  },

  deleteMeal: (mealId) => {
    return apiClient.delete(`/admin/training/nutrition/meals/${mealId}`);
  },

  deleteExercise: (exerciseId) => {
    return apiClient.delete(`/admin/training/workout/exercises/${exerciseId}`);
  },

  getProgress: (userId, year, month) => {
    return apiClient.get(`/admin/training/trainees/${userId}/progress`, {
      params: { year, month }
    });
  },
};

export default trainingApi;