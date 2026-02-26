'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle } from 'lucide-react'

const contactInfo = [
  {
    Icon: Mail,
    label: 'Email',
    value: 'support@halaltravels.com',
    href: 'mailto:support@halaltravels.com',
  },
  {
    Icon: Phone,
    label: 'Phone',
    value: '+966 000 000 000',
    href: 'tel:+966000000000',
  },
  {
    Icon: MapPin,
    label: 'Address',
    value: 'Riyadh, Saudi Arabia',
    href: null,
  },
  {
    Icon: Clock,
    label: 'Support Hours',
    value: '24 / 7 — every day',
    href: null,
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    // TODO: wire to real backend endpoint
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(20,184,166,0.15),transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

        <div className="relative container mx-auto px-4 pt-20 pb-16 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-400/20 px-4 py-2 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            <span className="text-teal-300 text-xs font-bold uppercase tracking-[0.18em]">Contact Us</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5">
            We&apos;re here to{' '}
            <span className="italic font-serif text-teal-300">help</span>
          </h1>
          <p className="text-white/50 text-lg leading-relaxed">
            Have a question, need a custom itinerary, or just want to say hello?
            Our team is available around the clock.
          </p>
        </div>
      </section>

      {/* ── Main Grid ── */}
      <section className="container mx-auto px-4 pb-28 max-w-5xl">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map(({ Icon, label, value, href }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 ring-1 ring-teal-500/20">
                  <Icon className="h-4 w-4 text-teal-300" />
                </div>
                <div>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.18em] mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-white/75 text-sm hover:text-teal-300 transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-white/75 text-sm">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-3xl blur-xl" />
              <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8">

                {sent ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                    <CheckCircle className="h-14 w-14 text-teal-400" />
                    <h3 className="text-xl font-semibold text-white">Message Sent!</h3>
                    <p className="text-white/50 max-w-xs">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                      className="mt-4 text-teal-400 text-sm hover:text-teal-300 transition-colors"
                    >
                      Send another message →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-white/50 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
                          Full Name
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Your name"
                          value={form.name}
                          onChange={e => update('name', e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-teal-500/50 focus:bg-white/8 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
                          Email Address
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={e => update('email', e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-teal-500/50 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/50 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
                        Subject
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="How can we help?"
                        value={form.subject}
                        onChange={e => update('subject', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-teal-500/50 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-white/50 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
                        Message
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us more..."
                        value={form.message}
                        onChange={e => update('message', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-teal-500/50 transition resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 text-white px-6 py-3.5 text-sm font-semibold hover:bg-teal-400 disabled:opacity-60 transition-colors"
                    >
                      {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                      ) : (
                        <><Send className="h-4 w-4" /> Send Message</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
