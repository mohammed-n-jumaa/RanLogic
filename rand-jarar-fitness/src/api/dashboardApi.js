import api from './index';

const dashboardApi = {
  getDashboard: async () => {
    const response = await api.get('/trainee/dashboard');
    return response.data;
  },

  logWeight: async (weight, loggedAt = null) => {
    const response = await api.post('/trainee/weight-log', {
      weight,
      logged_at: loggedAt,
    });
    return response.data;
  },

  logWater: async (cups) => {
    const response = await api.post('/trainee/water-log', { cups });
    return response.data;
  },

  logMeasurement: async (data) => {
    const response = await api.post('/trainee/body-measurement', data);
    return response.data;
  },

  uploadProgressPhoto: async (file, note = '', marketingConsent = false) => {
    const formData = new FormData();
    formData.append('photo', file);
    if (note) formData.append('note', note);
    formData.append('marketing_consent', marketingConsent ? '1' : '0');

    const response = await api.post('/trainee/progress-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  joinChallenge: async (id) => {
    const response = await api.post(`/trainee/challenges/${id}/join`);
    return response.data;
  },

  incrementChallenge: async (id) => {
    const response = await api.post(`/trainee/challenges/${id}/increment`);
    return response.data;
  },

  updateConsent: async (consent) => {
    const response = await api.post('/trainee/marketing-consent', {
      marketing_consent: consent ? 1 : 0,
    });
    return response.data;
  },
  
};


export default dashboardApi;