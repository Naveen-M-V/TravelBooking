import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Halal Travels',
  description: 'Understand the refund and cancellation terms for flights and holiday packages booked through Halal Travels.',
}

const sections = [
  {
    title: '1. Overview',
    body: `Halal Travels acts as an intermediary between travellers and service providers (airlines, hotels, and package operators). Refund and cancellation eligibility depends on the specific fare rules, hotel policies, and package terms applicable to your booking.`,
  },
  {
    title: '2. Flight Cancellations',
    body: `Cancellation eligibility and refund amounts for flights are governed by the fare rules set by the airline at the time of booking. Non-refundable fares will not be eligible for a cash refund but may be eligible for a credit or date change depending on the carrier. A Halal Travels service fee may apply to all cancellation requests.`,
  },
  {
    title: '3. Flight Date Changes',
    body: `Date changes are subject to airline change fees plus any fare difference. Requests must be submitted at least 24 hours before departure. Halal Travels will facilitate the change request on your behalf but cannot guarantee availability on the requested date.`,
  },
  {
    title: '4. Holiday Package Cancellations',
    body: `Holiday packages are subject to the following cancellation schedule:\n\n• More than 45 days before departure: Full refund minus deposit\n• 30–44 days before departure: 50% refund\n• 15–29 days before departure: 25% refund\n• Less than 14 days before departure: No refund\n\nCertain peak-season packages may carry different terms, which will be clearly stated at the time of booking.`,
  },
  {
    title: '5. Hotel Cancellations',
    body: `Hotel cancellation policies vary by property and rate type. Free cancellation is available on eligible rates up to the deadline specified at booking. Non-refundable rates will not be eligible for a refund under any circumstances.`,
  },
  {
    title: '6. Refund Processing',
    body: `Approved refunds will be processed to the original payment method within 7–14 business days. The exact timeline depends on your bank or card issuer. Halal Travels is not responsible for delays caused by financial institutions.`,
  },
  {
    title: '7. No-Show Policy',
    body: `Failure to check in for a flight or hotel without prior cancellation (no-show) will result in forfeiture of the full booking amount. No refund will be issued in such cases.`,
  },
  {
    title: '8. Force Majeure',
    body: `In the event of circumstances beyond our control (natural disasters, government restrictions, pandemics, etc.), Halal Travels will work with service providers to offer rebooking options or credits. Refunds in force majeure situations are subject to the individual supplier's policy.`,
  },
  {
    title: '9. How to Request a Cancellation',
    body: `To cancel or amend a booking, please log into your account and visit "My Bookings", or contact our support team at support@halaltravels.com with your booking reference. Requests are processed within 2 business days.`,
  },
]

function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string
  updated: string
  sections: { title: string; body: string }[]
}) {
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <div className="pointer-events-none h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(20,184,166,0.12),transparent)]" />
        <div className="relative container mx-auto px-4 pt-16 pb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-400/20 px-4 py-2 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            <span className="text-teal-300 text-xs font-bold uppercase tracking-[0.18em]">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{title}</h1>
          <p className="text-white/35 text-sm">Last updated: {updated}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-28 max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 space-y-10">
          {sections.map(({ title: st, body }) => (
            <div key={st}>
              <h2 className="text-white font-semibold text-lg mb-3">{st}</h2>
              <p className="text-white/55 leading-relaxed whitespace-pre-line">{body}</p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-8 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6 text-center">
          <p className="text-white/60 text-sm mb-3">
            Questions about your booking or a specific policy?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-teal-500 text-white px-6 py-2.5 text-sm font-semibold hover:bg-teal-400 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function RefundPolicyPage() {
  return <LegalPage title="Refund & Cancellation Policy" updated="1 January 2026" sections={sections} />
}
