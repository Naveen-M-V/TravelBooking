import apiClient from './client'

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  telephone?: string
  role?: string
}

export interface LoginData {
  email: string
  password: string
}

export const authAPI = {
  register: (data: RegisterData) =>
    apiClient.post('/auth/register', data).then((r) => r.data),

  login: (data: LoginData) =>
    apiClient.post('/auth/login', data).then((r) => r.data),

  logout: () =>
    apiClient.post('/auth/logout').then((r) => r.data),

  me: () =>
    apiClient.get('/auth/me').then((r) => r.data),
}
