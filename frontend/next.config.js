/** @type {import('next').NextConfig} */
const rawApiBase = process.env.NEXT_PUBLIC_API_URL
  || (process.env.NODE_ENV === 'production'
    ? 'https://htc-backend.vercel.app/api'
    : 'http://localhost:5000/api')

const normalizedApiBase = rawApiBase.trim().replace(/\/$/, '')
const apiBase = normalizedApiBase.endsWith('/api')
  ? normalizedApiBase
  : `${normalizedApiBase}/api`

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'instasize.com' },
      { protocol: 'https', hostname: 'www.instasize.com' },
      { protocol: 'https', hostname: 'wwyzjqdkzhqtrjuvfhyl.supabase.co' },
      { protocol: 'http',  hostname: 'localhost' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/HalalLogo.png',
      },
      {
        source: '/api/:path*',
        destination: `${apiBase}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
