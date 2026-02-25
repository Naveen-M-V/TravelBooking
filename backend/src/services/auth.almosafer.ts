/**
 * Almosafer OAuth2 Authentication Service
 *
 * Spec:
 *   POST /auth/api/v1.0/oauth2/token
 *     Body (x-www-form-urlencoded): username, password
 *     Returns: { access_token, token_type, refresh_token, scope, expires_in }
 *
 *   GET /auth/api/v1.0/oauth2/token?refresh_token=<token>
 *     Returns: same shape as above
 */

import almosaferClient, { almosaferConfig } from '../config/almosafer'

interface TokenCache {
  accessToken: string
  refreshToken: string | null
  expiresAt: number
}

let tokenCache: TokenCache | null = null

/**
 * Get a valid access token, using the cache if still valid,
 * using the stored refresh_token if available, or doing a full login.
 */
export async function getAlmosaferToken(): Promise<string> {
  // 1. Return cached token if still valid (with 60-second buffer)
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.accessToken
  }

  // 2. If we have a refresh token, use it
  if (tokenCache?.refreshToken) {
    try {
      return await refreshAlmosaferToken(tokenCache.refreshToken)
    } catch {
      // Fall through to full login if refresh fails
      tokenCache = null
    }
  }

  // 3. Full login with username + password (x-www-form-urlencoded per spec)
  try {
    const response = await almosaferClient.post(
      '/auth/api/v1.0/oauth2/token',
      new URLSearchParams({
        username: almosaferConfig.clientId,       // maps to ALMOSAFER_CLIENT_ID
        password: almosaferConfig.clientSecret,   // maps to ALMOSAFER_CLIENT_SECRET
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    const { access_token, refresh_token, expires_in } = response.data

    tokenCache = {
      accessToken: access_token,
      refreshToken: refresh_token ?? null,
      expiresAt: Date.now() + (expires_in - 60) * 1000,
    }

    return access_token
  } catch (error: any) {
    console.error('[Almosafer Auth] Login failed:', error.response?.data ?? error.message)
    throw new Error('Almosafer authentication failed')
  }
}

/**
 * Refresh the access token using the stored refresh_token.
 * Spec: GET /auth/api/v1.0/oauth2/token?refresh_token=<token>
 */
export async function refreshAlmosaferToken(refreshToken: string): Promise<string> {
  try {
    const response = await almosaferClient.get('/auth/api/v1.0/oauth2/token', {
      params: { refresh_token: refreshToken },
    })

    const { access_token, refresh_token: newRefresh, expires_in } = response.data

    tokenCache = {
      accessToken: access_token,
      refreshToken: newRefresh ?? refreshToken,
      expiresAt: Date.now() + (expires_in - 60) * 1000,
    }

    return access_token
  } catch (error: any) {
    console.error('[Almosafer Auth] Token refresh failed:', error.response?.data ?? error.message)
    throw new Error('Almosafer token refresh failed')
  }
}

/** Clear the token cache (e.g. on logout or 401 response) */
export function clearAlmosaferTokenCache(): void {
  tokenCache = null
}
