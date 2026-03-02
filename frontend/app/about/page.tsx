import type { Metadata } from 'next'
import Link from 'next/link'
import { Globe, Heart, BadgeCheck, Compass, Utensils, BookOpen, MapPin, XCircle, TrendingUp, Plane } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Halal Travels Club',
  description: 'Halal Travels Club \u2014 dedicated to delivering personalised Halal travel experiences for Muslims around the globe.',
}

const missionPoints = [
  {
    title: 'Promote Halal Tourism Globally',
    desc: 'Our mission is to raise awareness of the booming Halal tourism industry, offering travellers worldwide reliable, Halal-compliant travel services.',
  },
  {
    title: 'Build Trust in Halal Travel Standards',
    desc: 'We aim to set and promote the highest standards for Halal tourism globally, ensuring Muslim travellers have access to only the best and most respectful experiences.',
  },
  {
    title: 'Support Halal Travel Growth',
    desc: 'Through an easy-to-use platform, innovative media outreach, and strategic partnerships, we help expand the Halal tourism ecosystem.',
  },
  {
    title: 'Build a Global Halal Brand',
    desc: 'We are committed to creating a global platform that Muslims can rely on for all their travel needs, from Halal-friendly accommodations to cultural experiences.',
  },
]

const stats = [
  { value: '$200B+', label: 'Global Halal Travel Market' },
  { value: '9.1%',   label: 'Annual Growth Rate' },
  { value: '10%',    label: 'Global Tourism Share by 2025' },
  { value: '$300B',  label: 'Projected Spend by 2026' },
]

const halalServices = [
  { Icon: XCircle,  title: 'Mini Bar Removal in Hotel Rooms',   desc: 'No liquor or alcohol-related items in mini bars.' },
  { Icon: BookOpen, title: 'Prayer Mat in Hotel Rooms',          desc: 'Availability of Prayer Mat in Hotel Rooms.' },
  { Icon: Compass,  title: 'Qiblah Direction Clearly Indicated', desc: 'Hotel rooms feature a clearly marked Qiblah direction for convenient prayer.' },
  { Icon: MapPin,   title: 'Nearby Mosques',                     desc: 'Information on Nearby Mosques for ease of access to prayer facilities if available.' },
  { Icon: Utensils, title: 'Muslim-Friendly Restaurant',         desc: 'Information of closest Muslim Owned Restaurants if available.' },
]

const whyChoose = [
  { Icon: Globe,      title: 'Global Reach',           desc: 'We offer Muslim-friendly services in popular tourist destinations worldwide.' },
  { Icon: Heart,      title: 'Customised Experience',  desc: 'From Halal-friendly accommodations to dining options, every part of your trip is tailored to meet your specific needs and in line with your values.' },
  { Icon: BadgeCheck, title: 'Trusted Brand',           desc: 'Halal Travels Club is committed to transparency and trust, providing reliable and authentic Halal-friendly travel experiences ensuring our customers have a smooth and fulfilling travel experience.' },
]


export default function AboutPage() {
  return (
    <div className="bg-white text-gray-900">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0B1F3A] via-teal-800 to-[#0B2040] text-white py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
            <span className="text-teal-200 text-xs font-bold uppercase tracking-[0.18em]">#HTC Muslim Friendly Destination</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to<br />
            <span className="text-teal-300">Halal Travels Club</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
            At Halal Travels Club (#HTC), we are dedicated to delivering personalised Halal travel experiences
            for Muslims around the globe. With a growing number of Muslim travellers seeking vacation experiences
            that align with their religious values, Halal Travels Club provides a trusted platform for all
            things Halal in travel.
          </p>
        </div>
      </section>

      {/* Intro strip */}
      <section className="bg-white py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-gray-600 leading-relaxed text-lg">
            Our focus is on creating seamless, worry-free holidays by ensuring every detail — from accommodation
            to local dining — is Halal-compliant and offers a safe, comfortable, and spiritually uplifting journey.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-blue-50 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-teal-600 text-xs font-bold uppercase tracking-[0.18em] mb-3">Looking Ahead</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                Our Vision at Halaltravelsclub.com is to become the world&apos;s leading platform for Halal tourism,
                providing high-quality, ethically sound travel experiences for Muslims worldwide, and offering the
                most comprehensive Halal friendly travel solutions for every aspect of your trip.
              </p>
            </div>
            <div className="rounded-3xl bg-white border border-blue-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">World&apos;s Leading</p>
                  <p className="text-gray-500 text-sm">Halal Tourism Platform</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                High-quality, ethically sound travel experiences for Muslims worldwide — the most comprehensive
                Halal-friendly travel solutions for every aspect of your trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-teal-600 text-xs font-bold uppercase tracking-[0.18em] mb-3">Driving Purpose</p>
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {missionPoints.map(({ title, desc }, i) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm hover:shadow-md hover:border-teal-200 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-7 w-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-gray-900">{title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed pl-10">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Halal Tourism Matters */}
      <section className="bg-gradient-to-br from-[#0B1F3A] to-teal-800 text-white py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-teal-300 text-xs font-bold uppercase tracking-[0.18em] mb-3">Market Opportunity</p>
            <h2 className="text-3xl font-bold">Why Halal Tourism Matters</h2>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto">
              Halal tourism is one of the fastest-growing sectors in the global tourism industry.
              This demographic is increasingly looking for services that cater to their religious
              and cultural needs, and Halal Travels Club (#HTC) is here to meet that demand.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="rounded-2xl bg-white/10 border border-white/15 p-6 text-center">
                <div className="text-3xl font-bold text-teal-300 mb-2">{value}</div>
                <div className="text-white/55 text-xs uppercase tracking-wide leading-snug">{label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-white/50 text-sm max-w-3xl mx-auto">
            Annual Growth: The Halal tourism market is expanding at an impressive rate of 9.1% annually,
            with Muslim travellers expected to spend $300 billion by 2026. Halal travel is projected to
            grow by 11.3% year-on-year, particularly in destinations like the Middle East, Southeast Asia, and Europe.
          </p>
        </div>
      </section>

      {/* Halal Friendly Services */}
      <section className="bg-blue-50 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-teal-600 text-xs font-bold uppercase tracking-[0.18em] mb-3">#HTC</p>
            <h2 className="text-3xl font-bold text-gray-900">Halal Friendly Services</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              At Halal Travels Club (#HTC), we focus on providing travellers with the essential
              Halal-friendly services they need to enjoy their trips with confidence.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {halalServices.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-7 hover:shadow-md hover:border-teal-200 transition-all">
                <div className="h-11 w-11 rounded-xl bg-teal-50 ring-1 ring-teal-100 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose HTC */}
      <section className="bg-white py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-teal-600 text-xs font-bold uppercase tracking-[0.18em] mb-3">Why Us</p>
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Halal Travels Club (#HTC)?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {whyChoose.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-gray-200 p-8 text-center hover:shadow-md hover:border-teal-200 transition-all">
                <div className="h-14 w-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-5">
                  <Icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Start your Halal journey today</h2>
          <p className="text-gray-600 mb-8">Search thousands of halal-verified flights and curated holiday packages.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/flights"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 text-white px-8 py-3.5 text-sm font-semibold hover:bg-teal-700 transition-colors"
            >
              <Plane className="h-4 w-4" />
              Book a Flight
            </Link>
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-teal-600 text-teal-600 px-8 py-3.5 text-sm font-semibold hover:bg-teal-50 transition-colors"
            >
              View Packages
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}