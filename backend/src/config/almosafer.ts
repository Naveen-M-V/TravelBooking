import axios from 'axios'

const almosaferClient = axios.create({
  baseURL: process.env.ALMOSAFER_API_URL || 'https://apiv2.almosafer.com',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.ALMOSAFER_API_KEY || '',
  },
})

export const almosaferConfig = {
  clientId: process.env.ALMOSAFER_CLIENT_ID || '',
  clientSecret: process.env.ALMOSAFER_CLIENT_SECRET || '',
}

export default almosaferClient
