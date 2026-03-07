import apiClient from './client'

export const wishlistAPI = {
  getMine: () => apiClient.get('/wishlist/mine').then((r) => r.data),

  check: (packageId: string) => apiClient.get(`/wishlist/check/${packageId}`).then((r) => r.data),

  add: (packageId: string) => apiClient.post('/wishlist', { packageId }).then((r) => r.data),

  remove: (packageId: string) => apiClient.delete(`/wishlist/${packageId}`).then((r) => r.data),
}
