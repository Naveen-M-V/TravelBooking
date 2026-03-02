'use client'

import { BadgeCheck, Headphones, Lock, Plane, XCircle, BookOpen, Compass, MapPin, Utensils } from 'lucide-react'
import { SearchHero } from '@/components/search/SearchHero'
import { PackageCarousel } from '@/components/packages/PackageCarousel'
import { 
  getBestPackages, 
  getPopularPackages, 
  getTopDestinationPackages, 
  getFamilyPackages,
} from '@/mocks/featured-packages'

// TODO: Fetch dynamic backgrounds from backend
const heroBackgrounds = [
  '/images/hero/maldives-beach.jpg',
  '/images/hero/istanbul-mosque.jpg',
  '/images/hero/dubai-skyline.jpg',
  '/images/hero/makkah-haram.jpg',
]

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Search Section */}
      <SearchHero />

      {/* Why Choose Us strip */}
      <section className="py-12 px-4 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { Icon: BadgeCheck, title: 'Halal Verified', desc: 'Every stay, experience, and package is reviewed for halal compliance' },
            { Icon: Lock, title: 'Secure Checkout', desc: 'Encrypted payments with privacy-first data protection' },
            { Icon: Headphones, title: 'Concierge Support', desc: 'Specialists available whenever you need assistance' },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center group">
              <div className="mb-3 rounded-2xl bg-gray-50 ring-1 ring-gray-100 p-3 group-hover:scale-105 transition-transform duration-200">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-1.5 text-gray-800">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Explore</span>
            <h2 className="text-4xl font-extrabold mt-1 mb-3 text-gray-900">Discover Amazing Packages</h2>
            <div className="w-14 h-1 bg-primary rounded-full mx-auto mb-4" />
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Handpicked halal-friendly tours for unforgettable experiences
            </p>
          </div>

          {/* Our Best Tour Packages */}
          <PackageCarousel
            title="Our Best Tour Packages"
            packages={getBestPackages()}
          />

          {/* New & Most Popular Tours */}
          <PackageCarousel
            title="New &amp; Most Popular Tours"
            packages={getPopularPackages()}
            reverse
          />

          {/* Top Destinations */}
          <PackageCarousel
            title="Top Destinations"
            packages={getTopDestinationPackages()}
          />

          {/* Family Destinations */}
          <PackageCarousel
            title="Family Destinations"
            packages={getFamilyPackages()}
            reverse
          />
        </div>
      </section>

      {/* #HTC Muslim Friendly Services */}
      <section className="py-20 px-4 bg-blue-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 border border-teal-200 px-4 py-1.5 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span className="text-teal-700 text-xs font-bold uppercase tracking-[0.18em]">#HTC</span>
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-3">Halal / Muslim Friendly Services</h2>
            <div className="w-12 h-1 bg-teal-600 rounded-full mx-auto mb-4" />
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Every detail of your stay is carefully managed to meet your Halal travel needs
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { Icon: XCircle,   title: 'Mini Bar Removal in Hotel Rooms',      desc: 'No liquor or alcohol-related items in mini bars.' },
              { Icon: BookOpen,  title: 'Prayer Mat in Hotel Rooms',             desc: 'Availability of Prayer Mat in Hotel Rooms.' },
              { Icon: Compass,   title: 'Qiblah Direction Clearly Indicated',   desc: 'Hotel rooms feature a clearly marked Qiblah direction for convenient prayer.' },
              { Icon: MapPin,    title: 'Nearby Mosques',                        desc: 'Information on Nearby Mosques for ease of access to prayer facilities if available.' },
              { Icon: Utensils,  title: 'Muslim-Friendly Restaurant',            desc: 'Information of closest Muslim Owned Restaurants if available.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-white border border-gray-200 p-7 shadow-sm hover:shadow-md hover:border-teal-200 transition-all group">
                <div className="h-11 w-11 rounded-xl bg-teal-50 ring-1 ring-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
                  <Icon className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-[#0B6E63] text-white relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full pointer-events-none" />

        <div className="relative container mx-auto max-w-3xl text-center">
          <div className="mb-5 flex justify-center">
            <div className="rounded-2xl bg-white/10 ring-1 ring-white/15 p-3">
              <Plane className="h-9 w-9" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-lg mb-10 text-white/75 max-w-xl mx-auto leading-relaxed">
            Join 5,000+ Muslim travelers who trust Halal Travels for their journeys
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="btn-white-cta bg-white text-[#0B6E63] px-6 sm:px-9 py-3.5 rounded-xl font-bold text-base shadow-lg">
              Create Free Account
            </button>
            <button className="btn-teal-ghost border-2 border-white/50 text-white px-6 sm:px-9 py-3.5 rounded-xl font-bold text-base">
              Browse Packages
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

