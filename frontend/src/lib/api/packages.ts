import apiClient from './client'

export const packagesAPI = {
  getAll: (params?: { category?: string; isActive?: boolean }) =>
    apiClient.get('/packages', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get(`/packages/${id}`).then((r) => r.data),

  create: (data: object) =>
    apiClient.post('/packages', data).then((r) => r.data),

  update: (id: string, data: object) =>
    apiClient.put(`/packages/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/packages/${id}`).then((r) => r.data),
}
