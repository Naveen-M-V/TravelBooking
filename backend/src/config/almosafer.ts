import axios from 'axios'

// Build default headers — only include X-API-Key if one is actually configured
const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
}
if (process.env.ALMOSAFER_API_KEY) {
  defaultHeaders['X-API-Key'] = process.env.ALMOSAFER_API_KEY
}

const almosaferClient = axios.create({
  baseURL: process.env.ALMOSAFER_API_URL || 'https://apiv2.almosafer.com',
  headers: defaultHeaders,
})

export const almosaferConfig = {
  clientId: process.env.ALMOSAFER_CLIENT_ID || '',
  clientSecret: process.env.ALMOSAFER_CLIENT_SECRET || '',
}

export default almosaferClient
