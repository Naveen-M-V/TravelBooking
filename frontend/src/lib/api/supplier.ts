import apiClient from './client'

export const supplierAPI = {
  listAll: () =>
    apiClient.get('/suppliers').then(r => r.data),

  getById: (id: string) =>
    apiClient.get(`/suppliers/${id}`).then(r => r.data),

  create: (data: { name: string; email: string; phone?: string; contactPerson?: string; website?: string; notes?: string }) =>
    apiClient.post('/suppliers', data).then(r => r.data),

  update: (id: string, data: Partial<{ name: string; email: string; phone: string; contactPerson: string; website: string; notes: string; isActive: boolean }>) =>
    apiClient.put(`/suppliers/${id}`, data).then(r => r.data),

  deactivate: (id: string) =>
    apiClient.patch(`/suppliers/${id}/deactivate`).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(`/suppliers/${id}`).then(r => r.data),
}
