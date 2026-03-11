import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/context/AuthContext'
import ScrollReveal from '@/components/ScrollReveal'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Halal Travels - Book Flights & Packages',
  description: 'Travel booking platform for flights and holiday packages',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} theme-dim`}>
        <AuthProvider>
          <ScrollReveal />
          <Navbar />
          <main className="min-h-screen site-canvas">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
