/**
 * ODIS (Discover Saudi) API Client
 *
 * Sandbox:  https://api-sandbox.discoversaudi.sa
 * Docs:     https://api-docs.discoversaudi.sa/api
 *
 * Authentication: OAuth2 — POST /auth/api/v1.0/oauth2/token
 *   Body (x-www-form-urlencoded): username, password
 *   Returns: { access_token, token_type, refresh_token, scope, expires_in }
 */

import axios from 'axios'

const ODIS_API_URL = process.env.ODIS_API_URL || 'https://api-sandbox.discoversaudi.sa'

const odisClient = axios.create({
  baseURL: ODIS_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

export const odisConfig = {
  username: process.env.ODIS_USERNAME || '',
  password: process.env.ODIS_PASSWORD || '',
  baseUrl:  ODIS_API_URL,
}

export default odisClient
