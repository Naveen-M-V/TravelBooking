import apiClient from './client'

export const flightMarkupAPI = {
  /** Public: get the currently active markup rule */
  getActive: () =>
    apiClient.get('/flight-markup/active').then((r) => r.data),

  /** Admin: list all markup rules */
  getAll: () =>
    apiClient.get('/flight-markup').then((r) => r.data),

  /** Admin: create a new markup rule */
  create: (data: {
    name?: string
    markupType: 'PERCENT' | 'FIXED'
    markupValue: number
    currency?: string
    notes?: string
    isActive?: boolean
  }) => apiClient.post('/flight-markup', data).then((r) => r.data),

  /** Admin: update a markup rule */
  update: (id: string, data: object) =>
    apiClient.put(`/flight-markup/${id}`, data).then((r) => r.data),

  /** Admin: activate a specific rule */
  activate: (id: string) =>
    apiClient.post(`/flight-markup/${id}/activate`).then((r) => r.data),

  /** Admin: delete a markup rule */
  delete: (id: string) =>
    apiClient.delete(`/flight-markup/${id}`).then((r) => r.data),
}
