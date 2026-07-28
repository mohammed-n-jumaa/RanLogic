import apiClient from './index'

const BASE = '/link-profile/analytics'

const linkAnalyticsApi = {
  getSummary: (period) =>
    apiClient.get(`${BASE}/summary`, { params: { period } }),

  getLinks: (period) =>
    apiClient.get(`${BASE}/links`, { params: { period } }),

  getSocials: (period) =>
    apiClient.get(`${BASE}/socials`, { params: { period } }),
}

export default linkAnalyticsApi