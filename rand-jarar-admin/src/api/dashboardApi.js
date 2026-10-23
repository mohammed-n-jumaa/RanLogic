import apiClient from './apiClient';

// Run request factories a few at a time so loading the dashboard
// doesn't trip the API rate limit (429) with 9 simultaneous requests
const BATCH_SIZE = 3;
const inBatches = async (tasks) => {
  const results = [];
  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    results.push(...(await Promise.allSettled(tasks.slice(i, i + BATCH_SIZE).map((task) => task()))));
  }
  return results;
};

const dashboardAPI = {
  getMetrics: async () => {
    try {
      console.log('📊 Fetching metrics...');
      const response = await apiClient.get('/dashboard/metrics');
      
      if (response.data && response.data.success) {
        console.log('✅ Metrics loaded successfully:', response.data.data ? 'has data' : 'no data');
        return response.data.data || {};
      } else {
        console.warn('⚠️ Metrics API returned error or no data');
        return {};
      }
    } catch (error) {
      console.error('❌ Error fetching metrics:', error.message);
      // Never show made-up numbers: an empty object renders as "no data"
      return {};
    }
  },

  getGrowthData: async (period = 'this_week') => {
    try {
      const response = await apiClient.get(`/dashboard/charts/growth?period=${period}`);
      
      if (response.data && response.data.success) {
        console.log('✅ Growth data loaded');
        return response.data.data || [];
      } else {
        console.warn('⚠️ Growth data API returned error');
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching growth data:', error.message);
      return [];
    }
  },

 getRevenueData: async (period = 'this_week') => {
    try {
      const response = await apiClient.get(`/dashboard/charts/revenue?period=${period}`);
      
      if (response.data && response.data.success) {
        console.log('✅ Revenue data loaded');
        return response.data.data || [];
      } else {
        console.warn('⚠️ Revenue data API returned error');
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching revenue data:', error.message);
      return [];
    }
  },

  getPaymentStatusData: async () => {
    try {
      const response = await apiClient.get('/dashboard/charts/payment-status');
      
      if (response.data && response.data.success) {
        console.log('✅ Payment status data loaded');
        return response.data.data || [];
      } else {
        console.warn('⚠️ Payment status API returned error');
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching payment status data:', error.message);
      return [];
    }
  },

  getProgramTypeData: async () => {
    try {
      const response = await apiClient.get('/dashboard/charts/program-types');
      
      if (response.data && response.data.success) {
        console.log('✅ Program type data loaded');
        return response.data.data || [];
      } else {
        console.warn('⚠️ Program type API returned error');
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching program type data:', error.message);
      return [];
    }
  },


  getEngagementData: async () => {
    try {
      const response = await apiClient.get('/dashboard/charts/engagement');
      
      if (response.data && response.data.success) {
        console.log('✅ Engagement data loaded');
        return response.data.data || [];
      } else {
        console.warn('⚠️ Engagement data API returned error');
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching engagement data:', error.message);
      return [];
    }
  },

  getFunnelData: async () => {
    try {
      const response = await apiClient.get('/dashboard/charts/funnel');
      
      if (response.data && response.data.success) {
        console.log('✅ Funnel data loaded');
        return response.data.data || [];
      } else {
        console.warn('⚠️ Funnel data API returned error');
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching funnel data:', error.message);
      return [];
    }
  },

  getAlerts: async () => {
    try {
      const response = await apiClient.get('/dashboard/alerts');
      
      if (response.data && response.data.success) {
        console.log('✅ Alerts data loaded');
        return response.data.data || [];
      } else {
        console.warn('⚠️ Alerts API returned error');
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching alerts:', error.message);
      return [];
    }
  },

  getAllDashboardData: async (period = 'this_week') => {
    console.log('🚀 Fetching all dashboard data for period:', period);
    
    try {
      const results = await inBatches([
        () => dashboardAPI.getMetrics(),
        () => dashboardAPI.getGrowthData(period),
        () => dashboardAPI.getRevenueData(period),
        () => dashboardAPI.getPaymentStatusData(),
        () => dashboardAPI.getProgramTypeData(),
        () => dashboardAPI.getEngagementData(),
        () => dashboardAPI.getFunnelData(),
        () => dashboardAPI.getAlerts(),
      ]);

      console.log('✅ All API calls completed');
      
      const data = {
        metrics: results[0].status === 'fulfilled' ? results[0].value : {},
        growth: results[1].status === 'fulfilled' ? results[1].value : [],
        revenue: results[2].status === 'fulfilled' ? results[2].value : [],
        paymentStatus: results[3].status === 'fulfilled' ? results[3].value : [],
        programTypes: results[4].status === 'fulfilled' ? results[4].value : [],
        engagement: results[5].status === 'fulfilled' ? results[5].value : [],
        funnel: results[6].status === 'fulfilled' ? results[6].value : [],
        alerts: results[7].status === 'fulfilled' ? results[7].value : []
      };

      console.log('📦 Compiled data:', {
        hasMetrics: !!data.metrics && Object.keys(data.metrics).length > 0,
        metrics: data.metrics ? Object.keys(data.metrics) : [],
        otherData: {
          growth: data.growth?.length || 0,
          revenue: data.revenue?.length || 0,
          alerts: data.alerts?.length || 0
        }
      });
      
      return data;
    } catch (error) {
      console.error('❌ Error in getAllDashboardData:', error);
      
      return {
        metrics: {},
        growth: [],
        revenue: [],
        paymentStatus: [],
        programTypes: [],
        engagement: [],
        funnel: [],
        alerts: []
      };
    }
  }
};

export default dashboardAPI;