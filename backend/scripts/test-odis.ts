/**
 * Quick ODIS API diagnostic — run with:
 *   npx ts-node scripts/test-odis.ts
 *
 * Tests auth + search with both segment field-name conventions,
 * so we can see exactly which payload ODIS accepts.
 */

import axios from 'axios'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const BASE_URL = process.env.ODIS_API_URL || 'https://api-sandbox.discoversaudi.sa'
const USERNAME = process.env.ODIS_USERNAME || ''
const PASSWORD = process.env.ODIS_PASSWORD || ''

const client = axios.create({ baseURL: BASE_URL })

async function getToken(): Promise<string> {
  const res = await client.post(
    '/auth/api/v1.0/oauth2/token',
    new URLSearchParams({ username: USERNAME, password: PASSWORD }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  )
  console.log('✅  Auth success. Token type:', res.data.token_type)
  return res.data.access_token
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function testSearch(token: string, label: string, payload: object, retries = 3): Promise<void> {
  console.log(`\n--- Testing: ${label} ---`)
  console.log('Payload:', JSON.stringify(payload, null, 2))
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await client.post('/flights/api/v1.0/search', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log('✅  Success:', JSON.stringify(res.data, null, 2))
      return
    } catch (err: any) {
      const status = err.response?.status
      const body   = err.response?.data
      if (status === 429) {
        const retryAfter = Number(err.response?.headers?.['retry-after'] || 5)
        console.warn(`⏳  Rate-limited (429). Waiting ${retryAfter}s then retrying (${attempt}/${retries})…`)
        await sleep(retryAfter * 1000)
      } else {
        console.error(`❌  Status ${status}:`, JSON.stringify(body, null, 2))
        return // Non-429 errors are real — don't retry
      }
    }
  }
  console.error('❌  Gave up after rate-limit retries')
}

;(async () => {
  const token = await getToken()

  // Test only one convention at a time to stay under the rate limit.
  // Convention A — origin/destination (what we currently send)
  await testSearch(token, 'origin/destination keys', {
    segments: [{ origin: 'DXB', destination: 'KWI', departureDate: '2026-03-15' }],
    travellers: { adult: 1, child: 0, infant: 0 },
    cabinClass: 'ECONOMY',
    currency: 'SAR',
  })
})()
