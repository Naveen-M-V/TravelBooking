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
    <footer className="bg-[#0B1F3A] text-white">
      <div className="h-1 bg-gradient-to-r from-teal-400 via-blue-400 to-teal-400" />

      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand ── */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 ring-1 ring-teal-400/30">
                <span className="h-3 w-3 rounded-full bg-teal-300" />
              </span>
              <div>
                <span className="block text-sm font-bold tracking-[0.18em] uppercase text-white">
                  Halal Travels Club
                </span>
                <span className="block text-[10px] text-white/40 tracking-widest uppercase mt-0.5">
                  Destination Discoveries FZCO
                </span>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Your trusted partner for premium Halal-friendly travel experiences — flights, packages, and concierge support, all in one place.
            </p>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.18em] mb-3">Follow Us</p>
            <div className="flex items-center gap-2">
              {social.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 text-white/50 hover:bg-teal-500/20 hover:text-teal-300 hover:ring-teal-500/30 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* ── Legal ── */}
          <div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.18em] mb-5">Legal</p>
            <ul className="space-y-3">
              {legal.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-white/55 text-sm hover:text-teal-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.18em] mb-5">Contact Us</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
                <a
                  href="mailto:sales@halaltravelsclub.com"
                  className="text-white/55 text-sm hover:text-teal-300 transition-colors break-all"
                >
                  sales@halaltravelsclub.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
                <a
                  href="tel:+96591100975"
                  className="text-white/55 text-sm hover:text-teal-300 transition-colors"
                >
                  +965 91100975
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-center md:text-left">
            <p className="text-white/30 text-xs font-semibold uppercase tracking-widest">DESTINATION DISCOVERIES - FZCO</p>
            <p className="text-white/20 text-xs mt-0.5">© 2024 Halal Travels Club. All Rights Reserved.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {legal.map(({ label, href }) => (
              <Link key={label} href={href} className="text-white/25 text-xs hover:text-white/55 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
