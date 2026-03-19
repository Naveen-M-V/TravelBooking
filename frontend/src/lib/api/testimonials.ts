import apiClient from './client'

export type Testimonial = {
  id: string
  quote: string
  name: string
  city: string
  rating: number
}

export const testimonialsAPI = {
  getPublic: (params?: { limit?: number }) =>
    apiClient.get('/testimonials/public', { params }).then((r) => r.data as { success: boolean; testimonials: Testimonial[] }),
}
