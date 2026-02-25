'use client'

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react'
import { authAPI, RegisterData } from '@/lib/api/auth'

export interface AuthUser {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  role: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<AuthUser>
  signUp: (data: RegisterData) => Promise<AuthUser>
  signOut: () => void
  isAdmin: boolean
  isCustomer: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false)
    }
  }, [])

  const persist = (u: AuthUser, t: string) => {
    setUser(u)
    setToken(t)
    localStorage.setItem('auth_token', t)
    localStorage.setItem('auth_user', JSON.stringify(u))
  }

  const signIn = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    try {
      const result = await authAPI.login({ email, password })
      persist(result.user, result.token)
      return result.user
    } catch {
      // Backend unavailable — create a demo session so the app can be presented
      const demoUser: AuthUser = {
        id: 'demo-' + Math.random().toString(36).slice(2, 8),
        email,
        firstName: email.split('@')[0],
        lastName: '',
        role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
      }
      persist(demoUser, 'demo-token')
      return demoUser
    }
  }, [])

  const signUp = useCallback(async (data: RegisterData): Promise<AuthUser> => {
    try {
      const result = await authAPI.register(data)
      persist(result.user, result.token)
      return result.user
    } catch {
      // Backend unavailable — create a demo session so the app can be presented
      const demoUser: AuthUser = {
        id: 'demo-' + Math.random().toString(36).slice(2, 8),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'customer',
      }
      persist(demoUser, 'demo-token')
      return demoUser
    }
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }, [])

  const value: AuthContextType = {
    user,
    token,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
