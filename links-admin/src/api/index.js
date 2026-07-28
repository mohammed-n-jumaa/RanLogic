import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.ranlogic.com/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshResponse = await apiClient.post('/auth/refresh')
        const { token } = refreshResponse.data.data
        localStorage.setItem('auth_token', token)
        originalRequest.headers.Authorization = `Bearer ${token}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        window.location.href = '/admin/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient