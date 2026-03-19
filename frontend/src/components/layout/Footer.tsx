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
    <footer className="bg-gradient-to-br from-neutral-50 via-white to-neutral-100 text-neutral-800 relative overflow-hidden border-t border-neutral-200/80">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 right-0 h-56 w-56 rounded-full bg-neutral-200/55 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-neutral-100/70 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="rounded-[1.8rem] border border-neutral-200 bg-white/90 backdrop-blur-sm p-5 sm:p-6 shadow-xl shadow-primary-100/35">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr,0.8fr,1fr] items-start">
            <div>
              <Link href="/" className="inline-flex mb-4">
                <img src="/Halal-Logo-White-BG (1).svg" alt="Halal Travels Club" className="h-11 w-auto object-contain" />
              </Link>
              <p className="text-neutral-700 text-sm leading-relaxed max-w-md">
                Sleek halal-friendly travel planning with curated packages, trusted support, and transparent booking.
              </p>
              <div className="flex flex-wrap gap-2.5 mt-4">
                {social.map(({ label, href, Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200 text-primary-600 hover:bg-primary-500 hover:text-white transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/85 p-4">
              <p className="text-primary-700 text-[10px] font-semibold uppercase tracking-[0.2em] mb-3">Quick Links</p>
              <ul className="space-y-2">
                {legal.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-neutral-700 text-sm hover:text-primary-700 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/85 p-4">
              <p className="text-primary-700 text-[10px] font-semibold uppercase tracking-[0.2em] mb-3">Contact</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-neutral-200 text-primary-600">
                    <Mail className="h-4 w-4" />
                  </span>
                  <a href="mailto:sales@halaltravelsclub.com" className="text-neutral-700 text-sm hover:text-primary-700 transition-colors break-all">
                    sales@halaltravelsclub.com
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-neutral-200 text-primary-600">
                    <Phone className="h-4 w-4" />
                  </span>
                  <a href="tel:+96591100975" className="text-neutral-700 text-sm hover:text-primary-700 transition-colors">
                    +965 91100975
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <p className="text-neutral-600 text-xs">DESTINATION DISCOVERIES - FZCO</p>
            <p className="text-neutral-500 text-xs">© 2026 Halal Travels Club. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
