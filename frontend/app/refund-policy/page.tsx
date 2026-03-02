import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Halal Travels Club',
  description: 'Refund and Cancellation Policy for Destination Discoveries FZCO / Halal Travels Club.',
}

const sections = [
  {
    title: 'Introduction',
    body: `At Halal Travels Club, we strive to make your travel experience seamless. However, we understand that plans may change, so please read our Refund & Cancellation Policy carefully before booking.`,
  },
  {
    title: '1. Time Limit for Refunds',
    body: `\u2022 Most bookings are non-refundable.\n\u2022 Refunds, if any, are considered case-by-case.\n\u2022 There is no fixed automatic refund period (e.g., 24 or 48 hours).`,
  },
  {
    title: '2. Tour & Activity Bookings',
    body: `\u2022 Full Refund: Rare and approved in exceptional cases.\n\u2022 Partial Refund: Case-by-case before the service date.\n\u2022 No Refund: Cancellations close to the service date or in case of a no-show.`,
  },
  {
    title: '3. Airport Transfers & Chauffeur Services',
    body: `\u2022 Full Refund: Rare, only if approved.\n\u2022 Partial Refund: Case-by-case.\n\u2022 No Refund: Within 24 hours of pickup or in case of no-show.`,
  },
  {
    title: '4. Ticketing Refunds & Cancellations',
    body: `\u2022 Airline tickets and transport bookings are subject to the fare rules and refund policies of the respective airline or carrier.\n\u2022 Most airline tickets are non-refundable or may carry cancellation penalties.\n\u2022 Refund eligibility, if any, depends entirely on airline approval.\n\u2022 Service charges, administrative fees, payment gateway fees, and transaction charges are non-refundable.\n\u2022 Destination Discoveries FZCO / Halal Travels Club acts only as a facilitator and is not responsible for airline refund delays, rejections, or policy changes.\n\u2022 Refunds (if approved by the airline) are processed only after confirmation is received from the airline.`,
  },
  {
    title: '5. Hotel & Package Bookings',
    body: `\u2022 Refunds subject to individual hotel/partner policy.\n\u2022 Ground arrangements, hotels, transfers, and tours are generally non-refundable unless approved.`,
  },
  {
    title: '6. Event & Corporate Bookings',
    body: `Cancellation policies are communicated separately for group or corporate bookings.`,
  },
  {
    title: '7. Payment & Transaction Charges',
    body: `\u2022 UAE Cards: 2.30%\n\u2022 International Cards: 2.75%\n\u2022 Transaction Fee: AED 1 per transaction\n\u2022 One-Time Setup Fee: AED 5,000 (if applicable)\n\nNote: Transaction fees are non-refundable.`,
  },
  {
    title: '8. Refund Process',
    body: `\u2022 Refunds are processed within 14\u201330 working days after approval.\n\u2022 Refunds are issued via the original payment method.\n\u2022 Requests should be submitted to info@halaltravelsclub.com with booking details.`,
  },
  {
    title: '9. Force Majeure & Exceptional Cases',
    body: `In events like extreme weather, government restrictions, or emergencies, we may offer:\n\u2022 Alternative bookings\n\u2022 Partial refunds\n\u2022 Case-by-case solutions`,
  },
  {
    title: '10. Important Notes',
    body: `\u2022 Most services are non-refundable.\n\u2022 Refunds are subject to third-party confirmation and company discretion.\n\u2022 Flight bookings are not currently included.`,
  },
]

function LegalPage({
  title,
  breadcrumb,
  updated,
  sections,
}: {
  title: string
  breadcrumb: string
  updated: string
  sections: { title: string; body: string }[]
}) {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <section className="bg-gradient-to-br from-[#0B1F3A] via-teal-800 to-[#0B2040] text-white py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-teal-300 text-xs font-bold uppercase tracking-[0.18em] mb-2">
            Halal Travels Club › {breadcrumb}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-white/50 text-sm">Last updated: {updated}</p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-14 max-w-3xl">
        <div className="space-y-8">
          {sections.map(({ title: st, body }) => (
            <div key={st} className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="text-base font-bold text-gray-900 mb-3">{st}</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-teal-200 bg-teal-50 p-6 text-center">
          <p className="text-gray-600 text-sm mb-3">Questions about a refund or cancellation?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-teal-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function RefundPolicyPage() {
  return <LegalPage title="Refund & Cancellation Policy" breadcrumb="Refund & Cancellation Policy" updated="1 January 2026" sections={sections} />
}
