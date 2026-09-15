import api from './authApi';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.ranlogic.com/api';

const siteColorsApi = {
  /**
   * Fetch site colors from API (public endpoint, no auth needed)
   */
  getColors: async () => {
    try {
      const res = await fetch(`${API_BASE}/site-colors`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.warn('Failed to fetch site colors, using defaults:', error.message);
      return null;
    }
  },
};

export default siteColorsApi;
