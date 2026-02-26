import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Halal Travels',
  description: 'How Halal Travels collects, uses, and protects your personal information.',
}

const sections = [
  {
    title: '1. Information We Collect',
    body: `We collect information you provide directly — such as your name, email address, phone number, and payment details when you create an account or make a booking. We also collect usage data, device information, and cookies to improve your experience.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `Your information is used to process bookings, communicate with you about your trips, provide customer support, send promotional offers (only with your consent), and improve our platform and services.`,
  },
  {
    title: '3. Sharing of Information',
    body: `We do not sell your personal data. We share information only with trusted third-party service providers (airlines, hotels, payment processors) as necessary to fulfil your booking, and only under strict data protection agreements.`,
  },
  {
    title: '4. Data Retention',
    body: `We retain your personal data for as long as your account is active or as needed to provide you services. You may request deletion of your account and personal data at any time by contacting us.`,
  },
  {
    title: '5. Cookies',
    body: `We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and analyse site traffic. You can control cookie settings through your browser.`,
  },
  {
    title: '6. Data Security',
    body: `We implement industry-standard security measures, including TLS encryption, secure data centres, and access controls, to protect your personal information from unauthorised access or disclosure.`,
  },
  {
    title: '7. Your Rights',
    body: `You have the right to access, correct, or delete your personal data. You may also object to processing or request portability of your data. To exercise these rights, contact us at support@halaltravels.com.`,
  },
  {
    title: '8. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our platform. Continued use of the Service after changes constitutes acceptance.`,
  },
  {
    title: '9. Contact',
    body: `If you have any questions or concerns about this Privacy Policy, please contact our Data Protection team at support@halaltravels.com.`,
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
              <p className="text-white/55 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" updated="1 January 2026" sections={sections} />
}
