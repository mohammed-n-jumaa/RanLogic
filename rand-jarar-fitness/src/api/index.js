import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 60000, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    const language = localStorage.getItem('language') || 'ar';
    config.headers['Accept-Language'] = language;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    
    if (error.response) {
      switch (error.response.status) {
        case 401:

        localStorage.removeItem('auth_token');

        if (!window.location.pathname.includes('/auth')) {
            window.location.href = '/auth';
          }
          break;
        case 403:
          console.error('Access denied - 403');
          break;
        case 404:
          console.error('Resource not found - 404');
          break;
        case 422:
          console.error('Validation error - 422', error.response.data.errors);
          break;
        case 500:
          console.error('Server error - 500');
          break;
        default:
          console.error(`API error: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

api.checkConnection = async () => {
  try {
    const response = await api.get('/');
    return {
      connected: true,
      data: response.data
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
};

export default api;