import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Halal Travels',
  description: 'Read the Terms & Conditions for using Halal Travels.',
}

// Replace the sections array below with your actual content
const sections = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using the Halal Travels platform ("Service"), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you may not use our Service.`,
  },
  {
    title: '2. Use of Service',
    body: `You agree to use the Service only for lawful purposes. You must not use the Service in any way that breaches applicable local, national, or international laws or regulations, or in any way that is unlawful, fraudulent, or harmful.`,
  },
  {
    title: '3. Booking & Payment',
    body: `All bookings made through Halal Travels are subject to availability and confirmation. Payments are processed securely through our payment partners. Prices displayed are subject to change until a booking is confirmed.`,
  },
  {
    title: '4. Cancellations & Refunds',
    body: `Cancellation and refund terms vary by product type (flight, hotel, package). Please refer to our Refund & Cancellation Policy for full details before completing your booking.`,
  },
  {
    title: '5. Intellectual Property',
    body: `All content on the Halal Travels platform — including text, graphics, logos, and software — is the property of Halal Travels or its content suppliers and is protected by applicable intellectual property laws.`,
  },
  {
    title: '6. Limitation of Liability',
    body: `Halal Travels shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Service.`,
  },
  {
    title: '7. Changes to Terms',
    body: `We reserve the right to update these Terms & Conditions at any time. Changes will be effective immediately upon posting. Continued use of the Service after any changes constitutes acceptance of the new terms.`,
  },
  {
    title: '8. Governing Law',
    body: `These Terms & Conditions are governed by and construed in accordance with the laws of the Kingdom of Saudi Arabia.`,
  },
  {
    title: '9. Contact',
    body: `For any questions regarding these Terms & Conditions, please contact us at support@halaltravels.com.`,
  },
]

export default function TermsPage() {
  return <LegalPage title="Terms & Conditions" updated="1 January 2026" sections={sections} />
}

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

      {/* Header */}
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

      {/* Content */}
      <div className="container mx-auto px-4 pb-28 max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 space-y-10">
          {sections.map(({ title: st, body }) => (
            <div key={st}>
              <h2 className="text-white font-semibold text-lg mb-3">{st}</h2>
              <p className="text-white/55 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
