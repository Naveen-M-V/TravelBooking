import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'

const social = [
  { label: 'Facebook',  href: '#', Icon: Facebook  },
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'Twitter',   href: '#', Icon: Twitter   },
  { label: 'YouTube',   href: '#', Icon: Youtube   },
  { label: 'LinkedIn',  href: '#', Icon: Linkedin  },
]

const company = [
  { label: 'About Us',  href: '/about'   },
  { label: 'Contact Us',href: '/contact' },
  { label: 'Flights',   href: '/flights' },
  { label: 'Packages',  href: '/packages'},
]

const legal = [
  { label: 'Terms & Conditions',        href: '/terms'         },
  { label: 'Privacy Policy',            href: '/privacy'       },
  { label: 'Refund & Cancellation',     href: '/refund-policy' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10">
      {/* top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* ── Brand ── */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <span className="h-2 w-2 rounded-full bg-teal-300" />
              </span>
              <span className="text-sm font-semibold tracking-[0.22em] uppercase text-white/90">
                Halal Travels
              </span>
            </Link>

            <p className="text-white/45 text-sm leading-relaxed mb-8">
              Your trusted partner for premium halal-friendly travel experiences.
              Flights, packages, and concierge support — all in one place.
            </p>

            {/* Follow Us */}
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
              Follow Us
            </p>
            <div className="flex items-center gap-2">
              {social.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 text-white/45 hover:bg-teal-500/20 hover:text-teal-300 hover:ring-teal-500/30 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* ── Company ── */}
          <div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.18em] mb-5">
              Company
            </p>
            <ul className="space-y-3">
              {company.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/55 text-sm hover:text-teal-300 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Legal ── */}
          <div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.18em] mb-5">
              Legal
            </p>
            <ul className="space-y-3">
              {legal.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/55 text-sm hover:text-teal-300 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.18em] mb-5">
              Contact Us
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
                <a
                  href="mailto:support@halaltravels.com"
                  className="text-white/55 text-sm hover:text-teal-300 transition-colors"
                >
                  support@halaltravels.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
                <a
                  href="tel:+966000000000"
                  className="text-white/55 text-sm hover:text-teal-300 transition-colors"
                >
                  +966 000 000 000
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
                <span className="text-white/55 text-sm">
                  Riyadh, Saudi Arabia
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Halal Travels. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {legal.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-white/25 text-xs hover:text-white/55 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
