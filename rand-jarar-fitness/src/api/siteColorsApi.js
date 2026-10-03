const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.ranlogic.com/api';

const FETCH_TIMEOUT_MS = 5000;

const siteColorsApi = {
  /**
   * Fetch site colors from API (public endpoint, no auth needed)
   */
  getColors: async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(`${API_BASE}/site-colors`, { signal: controller.signal });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.warn('Failed to fetch site colors, using defaults:', error.message);
      return null;
    } finally {
      clearTimeout(timer);
    }
  },
};

export default siteColorsApi;
