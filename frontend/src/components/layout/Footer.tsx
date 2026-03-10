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
    <footer className="bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-700 text-white relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl"></div>
      </div>
      <div className="h-1.5 bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand ── */}
          <div className="lg:col-span-2 relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="relative flex items-center gap-3">
                <div className="absolute -inset-3 bg-white rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-sm shadow-xl border border-white/20 ring-1 ring-white/10">
                  <img src="/htc%20logo.png" alt="Halal Travels Club" className="h-10 w-10 object-contain filter brightness-0 invert" />
                  <div className="flex flex-col justify-center pr-1">
                    <span className="text-white font-extrabold text-base leading-tight tracking-tight">
                      Halal Travels Club
                    </span>
                    <span className="text-white/80 text-[9px] font-semibold uppercase tracking-[0.15em] leading-tight">
                      Destination Discoveries
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-sm">
              Your trusted partner for premium Halal-friendly travel experiences — flights, packages, and concierge support, all in one place.
            </p>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.18em] mb-3">Follow Us</p>
            <div className="flex items-center gap-3">
              {social.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30 text-white hover:bg-white hover:text-teal-600 hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* ── Legal ── */}
          <div className="relative z-10">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.18em] mb-5">Legal</p>
            <ul className="space-y-3">
              {legal.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-white/80 text-sm hover:text-white hover:translate-x-1 transition-all inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div className="relative z-10">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.18em] mb-5">Contact Us</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <a
                  href="mailto:sales@halaltravelsclub.com"
                  className="text-white/80 text-sm hover:text-white transition-colors break-all font-medium"
                >
                  sales@halaltravelsclub.com
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <a
                  href="tel:+96591100975"
                  className="text-white/80 text-sm hover:text-white transition-colors font-medium"
                >
                  +965 91100975
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/20 backdrop-blur-sm bg-white/5 relative z-10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-center md:text-left">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">DESTINATION DISCOVERIES - FZCO</p>
            <p className="text-white/60 text-xs mt-1 font-medium">© 2026 Halal Travels Club. All Rights Reserved.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {legal.map(({ label, href }) => (
              <Link key={label} href={href} className="text-white/60 text-xs hover:text-white transition-colors font-medium">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
