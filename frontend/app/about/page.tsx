import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Globe, Heart, Star, Users, Plane, ArrowRight, BadgeCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Halal Travels Club',
  description: 'Halal Travels Club — the world\'s leading platform for halal tourism. Discover our mission, real tour packages across Spain, Greece, Tanzania, Sri Lanka, and more.',
}

const values = [
  {
    Icon: Globe,
    title: 'Global Reach',
    desc: 'Muslim-friendly services across the world\'s most popular tourist destinations — from Europe\'s Islamic heritage cities to the beaches of Zanzibar.',
  },
  {
    Icon: Heart,
    title: 'Customised Experience',
    desc: 'Halal-friendly accommodations, dining, and guided tours — every part of your trip is tailored to your religious needs and personal preferences.',
  },
  {
    Icon: BadgeCheck,
    title: 'Trusted Brand',
    desc: 'Committed to transparency and trust. We deliver reliable, authentic halal-friendly travel experiences that Muslims can book with complete confidence.',
  },
  {
    Icon: ShieldCheck,
    title: 'Halal Verified',
    desc: 'Every package, hotel, and dining experience is carefully vetted for halal compliance — so you focus on the journey, not the research.',
  },
  {
    Icon: Users,
    title: 'Expert Guidance',
    desc: 'Our specialist travel team provides end-to-end support — from itinerary planning and visa assistance to on-the-ground local guides.',
  },
  {
    Icon: Star,
    title: 'Premium Experiences',
    desc: 'Luxury safari lodges, private guides, Islamic heritage tours, and bespoke couple and family packages crafted for discerning Muslim travellers.',
  },
]

const milestones = [
  { year: 'Our Mission', event: 'To become the World\'s Leading Platform for Halal Tourism, providing high-quality, ethically sound travel experiences for Muslims worldwide.' },
  { year: '$200B+', event: 'The global halal travel market is worth over $200 billion — with Muslim travellers projected to represent 10% of global tourism by 2025.' },
  { year: '9.1%', event: 'Annual growth rate of the halal travel sector, with halal-friendly services growing at 11.3% year-on-year.' },
  { year: '$300B', event: 'The halal travel market is expected to reach $300 billion by 2026 — Halal Travels Club is positioned at the forefront of this growth.' },
  { year: '#HTC', event: 'Destination Discoveries FZCO — trading as Halal Travels Club — is committed to being the most trusted name in halal tourism globally.' },
]

export default function AboutPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(20,184,166,0.18),transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

        <div className="relative container mx-auto px-4 pt-24 pb-20 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-400/20 px-4 py-2 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            <span className="text-teal-300 text-xs font-bold uppercase tracking-[0.18em]">About Us</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            The World&apos;s Leading{' '}
            <span className="italic font-serif text-teal-300">Halal</span>
            {' '}Travel <br className="hidden md:block" />
            Platform
          </h1>

          <p className="text-white/55 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Halal Travels Club was founded with a single vision: to become the world&apos;s leading platform 
            for halal tourism — delivering high-quality, ethically sound travel experiences for Muslims worldwide.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/flights"
              className="inline-flex items-center gap-2 rounded-full bg-teal-500 text-white px-7 py-3 text-sm font-semibold hover:bg-teal-400 transition-colors"
            >
              <Plane className="h-4 w-4" />
              Search Flights
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 text-white px-7 py-3 text-sm font-semibold hover:bg-white/20 transition-colors"
            >
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-3 max-w-2xl mx-auto text-center divide-x divide-white/10">
            {[
              { value: '$200B+', label: 'Global Halal Travel Market' },
              { value: '9.1%',   label: 'Annual Growth Rate' },
              { value: '$300B',  label: 'Projected by 2026' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-4">
                <div className="text-3xl font-bold text-teal-300 mb-1">{value}</div>
                <div className="text-white/40 text-xs uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="container mx-auto px-4 py-24 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.18em] mb-4">Our Mission</p>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Making halal travel <br />
              <span className="text-teal-300">simple, authentic,</span><br />
              and world-class
            </h2>
            <p className="text-white/55 leading-relaxed mb-6">
              We set out to solve a challenge every Muslim traveller faces: the exhausting research 
              required to verify that every part of a trip — the flights, the hotels, the food, 
              the experiences — truly aligns with Islamic values.
            </p>
            <p className="text-white/55 leading-relaxed">
              Halal Travels Club brings it all together — thoroughly verified, beautifully presented, 
              and supported by a team that genuinely understands what halal travel means.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-teal-500/5 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 space-y-6">
              <div>
                <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.18em] mb-2">Vision</p>
                <p className="text-white/80 leading-relaxed">
                  To become the World&apos;s Leading Platform for Halal Tourism — providing high-quality, 
                  ethically sound travel experiences for Muslims worldwide.
                </p>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.18em] mb-2">Why HTC</p>
                <p className="text-white/80 leading-relaxed">
                  Global reach, customised halal experiences, and a trusted brand — committed to 
                  transparency and delivering authentic halal-friendly travel that Muslims can rely on.
                </p>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.18em] mb-2">Contact</p>
                <p className="text-white/80 text-sm leading-relaxed">
                  sales@halaltravelsclub.com<br />
                  +965 91100975
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="border-t border-white/10 bg-white/[0.015]">
        <div className="container mx-auto px-4 py-24 max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.18em] mb-3">What We Stand For</p>
            <h2 className="text-4xl font-bold">Our Core Values</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 hover:border-teal-500/30 hover:bg-teal-500/5 transition-all duration-300"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10 ring-1 ring-teal-500/20 group-hover:bg-teal-500/20 transition-colors">
                  <Icon className="h-5 w-5 text-teal-300" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story / Timeline ── */}
      <section className="container mx-auto px-4 py-24 max-w-3xl">
        <div className="text-center mb-16">
          <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.18em] mb-3">The Halal Travel Market</p>
          <h2 className="text-4xl font-bold">Why Halal Tourism Matters</h2>
        </div>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-10 pl-16">
            {milestones.map(({ year, event }) => (
              <div key={year} className="relative">
                {/* dot */}
                <div className="absolute -left-10 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-teal-500/40 ring-4 ring-slate-950">
                  <span className="h-2 w-2 rounded-full bg-teal-400" />
                </div>
                <p className="text-teal-300 text-xs font-bold uppercase tracking-widest mb-1">{year}</p>
                <p className="text-white/65 leading-relaxed">{event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-white/10">
        <div className="container mx-auto px-4 py-24 text-center max-w-2xl">
          <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.18em] mb-4">Ready to Travel?</p>
          <h2 className="text-4xl font-bold mb-5">Start your halal journey today</h2>
          <p className="text-white/50 mb-10">
            Search thousands of halal-verified flights and curated holiday packages — all in minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/flights"
              className="inline-flex items-center gap-2 rounded-full bg-teal-500 text-white px-8 py-3.5 text-sm font-semibold hover:bg-teal-400 transition-colors"
            >
              <Plane className="h-4 w-4" />
              Book a Flight
            </Link>
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 text-white px-8 py-3.5 text-sm font-semibold hover:bg-white/20 transition-colors"
            >
              View Packages
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
