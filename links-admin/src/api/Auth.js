import apiClient from './index'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

class AuthService {
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      
      if (response.data.success) {
        const { token, user } = response.data.data
        
        if (user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.')
        }
        
        this.setToken(token)
        this.setUser(user)
        
        return { success: true, data: user }
      }
      
      return { success: false, error: response.data.message }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed'
      }
    }
  }
  
  async logout() {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearAuthData()
    }
  }
  
  async logoutAll() {
    try {
      await apiClient.post('/auth/logout-all')
    } catch (error) {
      console.error('Logout all error:', error)
    } finally {
      this.clearAuthData()
    }
  }
  
  async getCurrentUser() {
    try {
      const token = this.getToken()
      if (!token) {
        return { success: false, error: 'No token found' }
      }
      
      const response = await apiClient.get('/auth/me')
      
      if (response.data.success) {
        const user = response.data.data
        
        if (user.role !== 'admin') {
          this.clearAuthData()
          return { success: false, error: 'Access denied' }
        }
        
        this.setUser(user)
        return { success: true, data: user }
      }
      
      return { success: false, error: response.data.message }
    } catch (error) {
      if (error.response?.status === 401) {
        this.clearAuthData()
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get user'
      }
    }
  }
  
  async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh')
      
      if (response.data.success) {
        const { token } = response.data.data
        this.setToken(token)
        return { success: true, token }
      }
      
      return { success: false, error: response.data.message }
    } catch (error) {
      this.clearAuthData()
      return {
        success: false,
        error: error.response?.data?.message || 'Token refresh failed'
      }
    }
  }
  
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
  }
  
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  }
  
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
  
  getUser() {
    const userStr = localStorage.getItem(USER_KEY)
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }
  
  clearAuthData() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
  
  isAuthenticated() {
    const token = this.getToken()
    const user = this.getUser()
    return !!(token && user && user.role === 'admin')
  }
  
  hasActiveSubscription() {
    const user = this.getUser()
    return user?.has_active_subscription === true
  }
}

export default new AuthService()