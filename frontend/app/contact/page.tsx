'use client'

import { useState } from 'react'
import { Mail, Phone, Clock, Send, Loader2, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
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
    <div className="bg-white text-gray-900 min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0B1F3A] via-teal-800 to-[#0B2040] text-white py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
            <span className="text-teal-200 text-xs font-bold uppercase tracking-[0.18em]">Contact Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Need to contact us?</h1>
          <p className="text-white/65 text-lg">Our team is always happy to help.</p>
        </div>
      </section>

      {/* Contact cards + form */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Info cards */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-blue-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-teal-100">
                  <Phone className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">Emergency Helpline</p>
                  <p className="text-xs text-gray-500">Trip Queries</p>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">+965 91100975</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-blue-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-teal-100">
                  <Clock className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">Contactable Hours</p>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900">Mon–Sun: 24 Hours</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-blue-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-teal-100">
                  <Mail className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">Email Us</p>
                  <p className="text-xs text-gray-500">Require information about a trip?</p>
                </div>
              </div>
              <a
                href="mailto:sales@halaltravelsclub.com"
                className="text-teal-600 font-semibold hover:underline text-sm break-all"
              >
                sales@halaltravelsclub.com
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Drop us an email</h2>
              <p className="text-gray-500 text-sm mb-8">We&apos;ll get back to you within 48hrs…</p>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle className="h-14 w-14 text-teal-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
                  <p className="text-gray-500 mb-6">We&apos;ll get back to you within 48 hours.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', message: '' }) }}
                    className="text-teal-600 text-sm hover:underline"
                  >
                    Send another message →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 234 567 8901"
                      value={form.phone}
                      onChange={e => update('phone', e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      What&apos;s your Message?
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell us how we can help…"
                      value={form.message}
                      onChange={e => update('message', e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition resize-none"
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-600 text-white px-8 py-3.5 text-sm font-semibold hover:bg-teal-700 disabled:opacity-60 transition-colors"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {loading ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}