import apiClient from './client'

export const enquiryAPI = {
  create: (data: any) =>
    apiClient.post('/enquiries', data).then(r => r.data),

  listAll: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get('/enquiries', { params }).then(r => r.data),

  listMine: () =>
    apiClient.get('/enquiries/mine').then(r => r.data),

  getById: (id: string) =>
    apiClient.get(`/enquiries/${id}`).then(r => r.data),

  submitQuote: (id: string, data: { basePrice: number; markupPercentage: number; adminNotes?: string }) =>
    apiClient.post(`/enquiries/${id}/quote`, data).then(r => r.data),

  acceptQuote: (id: string) =>
    apiClient.post(`/enquiries/${id}/accept`, {}).then(r => r.data),

  cancel: (id: string) =>
    apiClient.post(`/enquiries/${id}/cancel`, {}).then(r => r.data),

  sendToSupplier: (id: string, supplierId: string) =>
    apiClient.post(`/enquiries/${id}/send-to-supplier`, { supplierId }).then(r => r.data),
}
