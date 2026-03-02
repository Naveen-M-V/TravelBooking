import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Halal Travels Club',
  description: 'Privacy Policy for Destination Discoveries FZCO / Halal Travels Club.',
}

const sections = [
  {
    title: '1. Information We Collect from You',
    body: `a. General Information\nWe collect and store non-sensitive information you provide on our website or via other means. This includes personal details such as your name, telephone number, email, and postal address. Sensitive information, such as credit/debit card numbers, is not stored. We may also collect traveller preferences such as meal requests, seat selection, loyalty program details, and ticketing options.\n\nb. Ticketing Information\nFor flight ticketing or travel-related reservations, we may collect and process:\n\u2022 Passenger full name as per passport or official ID\n\u2022 Passport or identification details (where required by the airline or authority)\n\u2022 Travel routes, dates, and booking references\n\u2022 Airline, transport provider, or service partner confirmations\n\nYou acknowledge that passenger details must be accurate and match official travel documents. Ticketing data may be retained as required for legal, regulatory, or audit purposes.\n\nc. Passenger Information\nWhen booking travel for others, we may request personal and travel details for that individual. You should ensure consent from the traveller, as access to view or modify their information will only be available via your account.\n\nd. Automatic Information\nWe automatically collect data such as your IP address, browser type, referring websites, and browsing activity to customise your website experience.\n\ne. Cookies\nCookies may be used to enhance your experience. You can disable cookies via your browser, though some website features may not function without them.`,
  },
  {
    title: '2. How We Protect Your Information',
    body: `We implement administrative, technical, and physical security measures to protect your data. Only authorised employees may access your information for business purposes. We use SSL encryption for data transmission and employ firewalls and intrusion detection systems. Payment processing is handled securely through trusted services, and we do not store sensitive payment details.`,
  },
  {
    title: '3. How We Use Your Information',
    body: `We use collected information to:\n\u2022 Provide requested products and services\n\u2022 Process travel bookings and ticket issuance\n\u2022 Manage your account and process payments\n\u2022 Communicate updates, confirmations, schedule changes, and ticketing notices\n\u2022 Improve our website and services\n\u2022 Conduct surveys and reward programs\n\u2022 Resolve disputes and enforce our Terms & Conditions\n\u2022 Prevent illegal or unauthorised activities`,
  },
  {
    title: '4. With Whom We Share Your Information',
    body: `We may share information with:\n\u2022 Suppliers (hotels, airlines, transport providers, tour operators) to fulfil bookings and issue tickets\n\u2022 Third-party vendors for payment processing, analytics, customer support, or fraud prevention\n\u2022 Legal or regulatory authorities when required\n\u2022 Corporate transactions such as mergers, restructuring, or asset sales\n\nWe restrict suppliers\u2019 use of your email and encourage reviewing their individual privacy policies.`,
  },
  {
    title: '5. Your Rights',
    body: `You may request access to your personal information and correct inaccuracies. You can also manage cookie settings via your browser, though this may affect website functionality.`,
  },
  {
    title: '6. Children\u2019s Privacy',
    body: `We do not sell services for children under the age of 13. If a child under 13 provides information, it will only be used to request parental consent.`,
  },
  {
    title: '7. External Links',
    body: `Our website may link to third-party websites with separate privacy policies. We are not responsible for their privacy practices.`,
  },
  {
    title: '8. Changes to This Privacy Policy',
    body: `We may update this Privacy Policy at any time. Any changes take effect once posted on the website. Users are encouraged to review this policy periodically.`,
  },
  {
    title: '9. Contact Us',
    body: `For questions regarding this Privacy Policy or your bookings, contact us:\n\nDestination Discoveries FZCO / Halal Travels Club\nEmail: info@halaltravelsclub.com`,
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
          <p className="text-gray-600 text-sm mb-3">Questions about your data or privacy?</p>
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

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" breadcrumb="Privacy Policy" updated="1 January 2026" sections={sections} />
}
