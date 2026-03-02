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

  verifyEmail: (token: string) =>
    apiClient.get(`/auth/verify-email/${token}`).then((r) => r.data),

  resendVerification: (email: string) =>
    apiClient.post('/auth/resend-verification', { email }).then((r) => r.data),

  inviteAdmin: (email: string) =>
    apiClient.post('/auth/invite-admin', { email }).then((r) => r.data),

  acceptInvite: (data: { token: string; password: string; firstName: string; lastName: string }) =>
    apiClient.post('/auth/accept-invite', data).then((r) => r.data),

  listUsers: (params?: { page?: number; limit?: number; role?: string }) =>
    apiClient.get('/auth/users', { params }).then((r) => r.data),

  updateUserRole: (userId: string, role: string) =>
    apiClient.put(`/auth/users/${userId}/role`, { role }).then((r) => r.data),
}

