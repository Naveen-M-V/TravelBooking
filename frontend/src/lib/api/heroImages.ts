import apiClient from './client'

export const heroImagesAPI = {
  getAll: (activeOnly = false) =>
    apiClient.get('/hero-images', { params: { activeOnly } }).then((r) => r.data),

  getPublic: () =>
    apiClient.get('/hero-images/public', { params: { activeOnly: true } }).then((r) => r.data),

  create: (data: { url: string; altText?: string; caption?: string; sortOrder?: number; isActive?: boolean }) =>
    apiClient.post('/hero-images', data).then((r) => r.data),

  update: (id: string, data: object) =>
    apiClient.put(`/hero-images/${id}`, data).then((r) => r.data),

  reorder: (orderedIds: string[]) =>
    apiClient.put('/hero-images/reorder', { orderedIds }).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/hero-images/${id}`).then((r) => r.data),
}
