import apiClient from './index'

const ENDPOINT = '/link-profile/links'

const linkApi = {
  getAll: () =>
    apiClient.get(ENDPOINT),

  create: (data) =>
    apiClient.post(ENDPOINT, mapToBackend(data)),

  update: (id, data) =>
    apiClient.put(`${ENDPOINT}/${id}`, mapToBackend(data)),

  remove: (id) =>
    apiClient.delete(`${ENDPOINT}/${id}`),

  toggle: (id) =>
    apiClient.patch(`${ENDPOINT}/${id}/toggle`),

  reorder: (items) =>
    apiClient.post(`${ENDPOINT}/reorder`, {
      items: items.map((l) => ({ id: Number(l.id), order: l.order })),
    }),

  recordClick: (id) =>
    apiClient.post(`${ENDPOINT}/${id}/click`),
}

function mapToBackend(link) {
  return {
    title:      link.title,
    url:        link.url,
    icon:       link.icon,
    active:     link.active,
    title_font: link.titleFont,
  }
}

export default linkApi