import apiClient from './client'

export const couponsAPI = {
  getAll: (params?: { type?: string; isActive?: boolean }) =>
    apiClient.get('/coupons', { params }).then((r) => r.data),

  validate: (data: { code: string; orderValue: number; type: 'PACKAGE' | 'FLIGHT' }) =>
    apiClient.post('/coupons/validate', data).then((r) => r.data),

  create: (data: object) =>
    apiClient.post('/coupons', data).then((r) => r.data),

  update: (id: string, data: object) =>
    apiClient.put(`/coupons/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/coupons/${id}`).then((r) => r.data),
}
