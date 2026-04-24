'use client'

import { MessageCircle } from 'lucide-react'

const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
const defaultMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Hello, I would like to know more about your travel packages.'

function normalizePhone(value: string) {
  return value.replace(/[^\d]/g, '')
}

export default function WhatsAppButton() {
  const phone = normalizePhone(rawNumber)

  if (!phone) return null

  const href = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMessage)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_12px_30px_rgba(16,185,129,0.35)] transition-transform hover:scale-110 hover:bg-green-600"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}