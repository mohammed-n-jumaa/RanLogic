import axios from 'axios';

/**
 * API Configuration
 * Base URL should be set in .env file as VITE_API_URL
 * 
 * Note: Vite uses VITE_ prefix instead of REACT_APP_
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

/**
 * Request interceptor
 * Adds authentication token to every request
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles common response scenarios and authentication errors
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.error('Unauthorized access - please login');
          
          // Clear auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
          
          // Redirect to login only if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden - insufficient permissions');
          break;
          
        case 404:
          // Not found
          console.error('Resource not found');
          break;
          
        case 422:
          // Validation error
          console.error('Validation error:', error.response.data.errors);
          break;
          
        case 429:
          // Too many requests - rate limited
          console.error('Too many requests - please try again later');
          break;
          
        case 500:
          // Server error
          console.error('Server error - please try again later');
          break;
          
        default:
          console.error('An error occurred:', error.response.data.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response from server - check your connection');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;