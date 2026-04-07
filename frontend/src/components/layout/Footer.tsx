import Link from 'next/link'
import { Mail, Phone, Facebook, Instagram, Linkedin } from 'lucide-react'

const social = [
  { label: 'Facebook',  href: '#', Icon: Facebook  },
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'LinkedIn',  href: '#', Icon: Linkedin  },
]

const legal = [
  { label: 'Terms & Conditions', href: '/terms'         },
  { label: 'Refund Policy',      href: '/refund-policy' },
  { label: 'Privacy Policy',     href: '/privacy'       },
]

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-neutral-50 via-white to-neutral-50 text-neutral-800 relative overflow-hidden border-t border-neutral-200/80">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 right-0 h-48 w-48 rounded-full bg-primary-100/60 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-neutral-200/55 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="rounded-[1.5rem] border border-neutral-200 bg-white/85 backdrop-blur-sm shadow-lg shadow-primary-100/30 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-accent-300" />

          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
              <div className="lg:col-span-6">
                <Link href="/" className="inline-flex items-center gap-3">
                  <img src="/Halal-Logo-White-BG (1).svg" alt="Halal Travels Club" className="h-10 w-auto object-contain" />
                </Link>

                <p className="mt-3 text-neutral-600 text-sm leading-relaxed max-w-md">
                  Sleek halal-friendly travel planning with curated packages, trusted support, and transparent booking.
                </p>

                <div className="flex flex-wrap gap-2.5 mt-4">
                  {social.map(({ label, href, Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      aria-label={label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200 text-primary-600 transition-all duration-200 hover:-translate-y-[1px] hover:bg-gradient-to-br hover:from-primary-500 hover:to-accent-500 hover:text-white hover:ring-primary-200 hover:shadow-lg hover:shadow-primary-200/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3">
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-700 mb-3">
                  Quick Links
                </p>
                <ul className="space-y-2">
                  {legal.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="text-neutral-600 text-sm hover:text-primary-700 transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-3">
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-700 mb-3">
                  Contact
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2.5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200 text-primary-600">
                      <Mail className="h-4 w-4" />
                    </span>
                    <a href="mailto:sales@halaltravelsclub.com" className="text-neutral-600 text-sm hover:text-primary-700 transition-colors break-all">
                      sales@halaltravelsclub.com
                    </a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200 text-primary-600">
                      <Phone className="h-4 w-4" />
                    </span>
                    <a href="tel:+96591100975" className="text-neutral-600 text-sm hover:text-primary-700 transition-colors">
                      +965 91100975
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-3 border-t border-neutral-200 bg-neutral-50/70 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-neutral-500 text-[11px] tracking-wide">DESTINATION DISCOVERIES - FZCO</p>
            <p className="text-neutral-500 text-[11px]">© 2026 Halal Travels Club. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
