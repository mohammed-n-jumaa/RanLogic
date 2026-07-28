import apiClient from './index'

const linkThemeApi = {
  get: () =>
    apiClient.get('/link-profile/theme'),

  update: (themeId) =>
    apiClient.put('/link-profile/theme', { theme_id: themeId }),
}
export default linkThemeApi