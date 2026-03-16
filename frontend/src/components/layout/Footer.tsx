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
    <footer className="bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-100 pointer-events-none">
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-[#f6871f]/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
      </div>
      <div className="h-1.5 bg-gradient-to-r from-transparent via-[#f8cf9f]/80 to-transparent" />

      <div className="container mx-auto px-4 py-14 relative z-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr,0.9fr,1fr] lg:gap-12">

          <div>
            <Link href="/" className="inline-flex mb-6 group">
              <div className="relative rounded-[28px] border border-white/12 bg-white/8 px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-0.5">
                <img src="/Halal-Logo-White-BR.svg" alt="Halal Travels Club" className="h-16 w-auto object-contain sm:h-20" />
              </div>
            </Link>
            <p className="text-white/84 text-sm leading-relaxed mb-6 max-w-md">
              Premium halal-friendly travel, designed with clarity and care — curated packages, flight support, and concierge guidance in one trusted journey.
            </p>
            <div className="flex flex-wrap gap-3">
              {social.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/15 text-white hover:bg-[#f6871f] hover:text-white hover:ring-[#f8cf9f]/40 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* ── Legal ── */}
          <div>
            <p className="text-[#f7c28f] text-[10px] font-bold uppercase tracking-[0.22em] mb-5">Quick Links</p>
            <ul className="space-y-3">
              {legal.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-white/78 text-sm hover:text-white hover:translate-x-1 transition-all inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <p className="text-[#f7c28f] text-[10px] font-bold uppercase tracking-[0.22em] mb-5">Contact Us</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/12">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <a
                  href="mailto:sales@halaltravelsclub.com"
                  className="text-white/82 text-sm hover:text-white transition-colors break-all font-medium"
                >
                  sales@halaltravelsclub.com
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/12">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <a
                  href="tel:+96591100975"
                  className="text-white/82 text-sm hover:text-white transition-colors font-medium"
                >
                  +965 91100975
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/12 backdrop-blur-sm bg-slate-950/20 relative z-10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-center md:text-left">
            <p className="text-white/72 text-xs font-bold uppercase tracking-widest">DESTINATION DISCOVERIES - FZCO</p>
            <p className="text-white/58 text-xs mt-1 font-medium">© 2026 Halal Travels Club. All Rights Reserved.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {legal.map(({ label, href }) => (
              <Link key={label} href={href} className="text-white/58 text-xs hover:text-white transition-colors font-medium">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
