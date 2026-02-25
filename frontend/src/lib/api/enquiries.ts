import apiClient from './client'

export interface SubmitEnquiryData {
  packageId: string
  packageName: string
  packageDestination: string
  packageDetails: object
  customerName: string
  customerEmail: string
  customerPhone: string
  nationality?: string
  travelDate?: string
  flexibleDates?: boolean
  adults?: number
  children?: number
  infants?: number
  specialRequests?: string
}

export const enquiryAPI = {
  /** Submit a new package enquiry */
  submit: (data: SubmitEnquiryData) =>
    apiClient.post('/enquiries', data).then((r) => r.data),

  /** Customer: get my enquiries */
  getMine: () =>
    apiClient.get('/enquiries/mine').then((r) => r.data),

  /** Admin: get all enquiries */
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get('/enquiries', { params }).then((r) => r.data),

  /** Get single enquiry */
  getOne: (id: string) =>
    apiClient.get(`/enquiries/${id}`).then((r) => r.data),

  /** Admin: submit price quote */
  submitQuote: (id: string, data: { basePrice: number; markupPercentage: number; adminNotes?: string }) =>
    apiClient.post(`/enquiries/${id}/quote`, data).then((r) => r.data),

  /** Customer: accept a quote */
  acceptQuote: (id: string) =>
    apiClient.post(`/enquiries/${id}/accept`).then((r) => r.data),

  /** Admin: cancel an enquiry */
  cancel: (id: string) =>
    apiClient.post(`/enquiries/${id}/cancel`).then((r) => r.data),
}

export const paymentAPI = {
  /** Initiate CCAvenue payment for an enquiry */
  initiate: (enquiryId: string) =>
    apiClient.post('/payments/initiate', { enquiryId }).then((r) => r.data),

  /** Check payment status */
  getStatus: (enquiryId: string) =>
    apiClient.get(`/payments/${enquiryId}/status`).then((r) => r.data),
}
