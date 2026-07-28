import apiClient from './apiClient';

const subscriptionsApi = {
  /**
   * Get all PayPal subscriptions with filters
   */
  getPayPalSubscriptions: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/subscriptions/paypal', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching PayPal subscriptions:', error);
      throw error;
    }
  },

  /**
   * Get all bank transfer subscriptions with filters
   */
  getBankTransferSubscriptions: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/subscriptions/bank-transfer', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching bank transfer subscriptions:', error);
      throw error;
    }
  },

  /**
   * Get subscription statistics
   */
  getSubscriptionStats: async () => {
    try {
      const response = await apiClient.get('/admin/subscriptions/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription stats:', error);
      throw error;
    }
  },

  /**
   * Create new PayPal subscription (manual)
   */
  createPayPalSubscription: async (data) => {
    try {
      const response = await apiClient.post('/admin/subscriptions/paypal', data);
      return response.data;
    } catch (error) {
      console.error('Error creating PayPal subscription:', error);
      throw error;
    }
  },

  /**
   * Update subscription
   */
  updateSubscription: async (id, data) => {
    try {
      const response = await apiClient.put(`/admin/subscriptions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  },

  /**
   * Delete subscription
   */
  deleteSubscription: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/subscriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  },

  /**
   * Approve bank transfer subscription
   */
  approveBankTransfer: async (id, data) => {
    try {
      const response = await apiClient.post(`/admin/subscriptions/${id}/approve`, data);
      return response.data;
    } catch (error) {
      console.error('Error approving subscription:', error);
      throw error;
    }
  },

  /**
   * Reject bank transfer subscription
   */
  rejectBankTransfer: async (id, data) => {
    try {
      const response = await apiClient.post(`/admin/subscriptions/${id}/reject`, data);
      return response.data;
    } catch (error) {
      console.error('Error rejecting subscription:', error);
      throw error;
    }
  },

  /**
   * Get all users for subscription creation
   */
  getUsers: async (search = '') => {
    try {
      const response = await apiClient.get('/admin/users', {
        params: { search, role: 'user' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Get subscription plans
   */
  getPlans: async (locale = 'ar') => {
    try {
      const response = await apiClient.get('/subscriptions/plans', {
        params: { locale }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  }
};

export default subscriptionsApi;