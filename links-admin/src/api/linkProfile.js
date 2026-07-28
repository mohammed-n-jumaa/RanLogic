import apiClient from './index'

const LinkProfileApi = {
  get: () =>
    apiClient.get('/link-profile'),

  update: (data) =>
    apiClient.put('/link-profile', data),

  uploadPhoto: (file) => {
    const form = new FormData()
    form.append('photo', file)
    return apiClient.post('/link-profile/photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  deletePhoto: () =>
    apiClient.delete('/link-profile/photo'),
}

export default LinkProfileApi