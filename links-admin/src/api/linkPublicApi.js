import apiClient from './index'

const BASE = '/public'

const linkPublicApi = {
  getProfile: () =>
    apiClient.get(`${BASE}/profile`),

  recordLinkClick: (id) =>
    apiClient.post(`${BASE}/links/${id}/click`),

  recordSocialClick: (platform) =>
    apiClient.post(`${BASE}/social/click`, { platform }),
}

export default linkPublicApi