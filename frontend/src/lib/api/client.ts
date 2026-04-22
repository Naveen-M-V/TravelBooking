import axios from 'axios'

// Prefer explicit backend URL in all environments when provided.
// Fallback to Next.js rewrite path in browser and localhost for SSR/dev.
const ENV_API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')
const API_URL =
  ENV_API_URL ||
  (typeof window !== 'undefined' ? '/api' : 'http://localhost:5000/api')

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
  timeout: 15000, // 15 seconds
})

// Attach token from localStorage on every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Global response error handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      // Optionally redirect to login
    }
    return Promise.reject(error)
  }
)

export default apiClient
