import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Globe, Heart, Star, Users, Plane, ArrowRight, BadgeCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Halal Travels',
  description: 'Learn about Halal Travels — our mission, values, and commitment to exceptional halal-friendly travel experiences.',
}

const values = [
  {
    Icon: ShieldCheck,
    title: 'Halal Certified',
    desc: 'Every flight route, hotel, and package is rigorously vetted to meet halal standards — so you travel with complete peace of mind.',
  },
  {
    Icon: BadgeCheck,
    title: 'Transparency',
    desc: 'No hidden fees. No surprises. Clear pricing, honest policies, and straightforward booking from first search to final confirmation.',
  },
  {
    Icon: Heart,
    title: 'Traveller First',
    desc: 'We listen, adapt, and go the extra mile. Every decision we make is driven by what matters most to our travellers.',
  },
  {
    Icon: Globe,
    title: 'Global Reach',
    desc: 'From Makkah to the Maldives, Istanbul to Kuala Lumpur — 50+ halal-friendly destinations across four continents.',
  },
  {
    Icon: Users,
    title: 'Expert Concierge',
    desc: 'Our specialist team is available around the clock to assist with itineraries, enquiries, and last-minute changes.',
  },
  {
    Icon: Star,
    title: 'Premium Experience',
    desc: 'Curated packages, premium cabin upgrades, and bespoke itineraries crafted for discerning Muslim travellers.',
  },
]

const milestones = [
  { year: '2019', event: 'Halal Travels founded with a vision to simplify halal-friendly travel.' },
  { year: '2021', event: 'Expanded to 20+ destinations across Asia, the Middle East, and Europe.' },
  { year: '2023', event: 'Launched our proprietary booking platform with live flight search.' },
  { year: '2024', event: 'Surpassed 5,000 verified bookings with a 4.9-star customer rating.' },
  { year: '2026', event: 'Now serving travellers in 50+ cities with round-the-clock concierge support.' },
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
            Travel with{' '}
            <span className="italic font-serif text-teal-300">purpose</span>
            {' '}and <br className="hidden md:block" />
            peace of mind
          </h1>

          <p className="text-white/55 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Halal Travels was founded with a single belief: that Muslim travellers deserve 
            a booking experience built entirely around their values, lifestyle, and faith.
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
              { value: '5,000+', label: 'Verified Bookings' },
              { value: '50+',    label: 'Destinations' },
              { value: '4.9★',   label: 'Avg. Rating' },
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
              <span className="text-teal-300">simple, accessible,</span><br />
              and premium
            </h2>
            <p className="text-white/55 leading-relaxed mb-6">
              We set out to solve a problem every Muslim traveller knows: the exhausting research 
              required to verify that every component of a trip — the flights, the hotels, the 
              food, the experiences — truly aligns with Islamic values.
            </p>
            <p className="text-white/55 leading-relaxed">
              Our platform brings all of that together, thoroughly verified, beautifully presented, 
              and supported by a team that understands what halal travel really means.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-teal-500/5 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 space-y-6">
              <div>
                <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.18em] mb-2">Vision</p>
                <p className="text-white/80 leading-relaxed">
                  To become the world&apos;s most trusted halal travel platform — where every Muslim 
                  family books with complete confidence.
                </p>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.18em] mb-2">Promise</p>
                <p className="text-white/80 leading-relaxed">
                  Every listing on Halal Travels is reviewed against our halal compliance criteria 
                  before it appears on our platform. No exceptions.
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
          <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.18em] mb-3">Our Journey</p>
          <h2 className="text-4xl font-bold">How We Got Here</h2>
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
