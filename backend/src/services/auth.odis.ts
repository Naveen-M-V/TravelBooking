/**
 * ODIS OAuth2 Token Service
 *
 * Auth endpoint:
 *   POST /auth/api/v1.0/oauth2/token
 *     Body (x-www-form-urlencoded): username, password
 *     Returns: { access_token, token_type, refresh_token, scope, expires_in }
 *
 *   Refresh:
 *   GET /auth/api/v1.0/oauth2/token?refresh_token=<token>
 *     Returns: same shape as above
 */

import odisClient, { odisConfig } from '../config/odis'

interface TokenCache {
  accessToken: string
  refreshToken: string | null
  expiresAt: number
}

let tokenCache: TokenCache | null = null

/**
 * Get a valid ODIS access token.
 * Hierarchy: cache → refresh_token → full login
 */
export async function getOdisToken(): Promise<string> {
  // 1. Return cached token if still valid (60-second buffer)
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.accessToken
  }

  // 2. If we have a refresh token, try it first
  if (tokenCache?.refreshToken) {
    try {
      return await refreshOdisToken(tokenCache.refreshToken)
    } catch {
      tokenCache = null // fall through to full login
    }
  }

  // 3. Full login with username + password (x-www-form-urlencoded)
  try {
    const response = await odisClient.post(
      '/auth/api/v1.0/oauth2/token',
      new URLSearchParams({
        username: odisConfig.username,
        password: odisConfig.password,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    const { access_token, refresh_token, expires_in } = response.data

    tokenCache = {
      accessToken:  access_token,
      refreshToken: refresh_token ?? null,
      expiresAt:    Date.now() + (expires_in - 60) * 1000,
    }

    console.log('[ODIS Auth] Token obtained successfully')
    return access_token
  } catch (error: any) {
    console.error('[ODIS Auth] Login failed:', error.response?.data ?? error.message)
    throw new Error('ODIS authentication failed')
  }
}

/**
 * Refresh the access token using a stored refresh_token.
 * Spec: GET /auth/api/v1.0/oauth2/token?refresh_token=<token>
 */
export async function refreshOdisToken(refreshToken: string): Promise<string> {
  try {
    const response = await odisClient.get('/auth/api/v1.0/oauth2/token', {
      params: { refresh_token: refreshToken },
    })

    const { access_token, refresh_token: newRefresh, expires_in } = response.data

    tokenCache = {
      accessToken:  access_token,
      refreshToken: newRefresh ?? refreshToken,
      expiresAt:    Date.now() + (expires_in - 60) * 1000,
    }

    console.log('[ODIS Auth] Token refreshed successfully')
    return access_token
  } catch (error: any) {
    console.error('[ODIS Auth] Token refresh failed:', error.response?.data ?? error.message)
    throw new Error('ODIS token refresh failed')
  }
}

/** Clear token cache (call on 401 responses) */
export function clearOdisTokenCache(): void {
  tokenCache = null
}
