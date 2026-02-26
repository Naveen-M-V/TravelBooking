'use client'

import { useState } from 'react'
import { BadgeCheck, Headphones, Lock, Plane } from 'lucide-react'
import { SearchHero } from '@/components/search/SearchHero'
import { PackageCarousel } from '@/components/packages/PackageCarousel'
import { PackageDetailsModal } from '@/components/packages/PackageDetailsModal'
import { 
  getBestPackages, 
  getPopularPackages, 
  getTopDestinationPackages, 
  getFamilyPackages,
  type FeaturedPackage
} from '@/mocks/featured-packages'

// TODO: Fetch dynamic backgrounds from backend
const heroBackgrounds = [
  '/images/hero/maldives-beach.jpg',
  '/images/hero/istanbul-mosque.jpg',
  '/images/hero/dubai-skyline.jpg',
  '/images/hero/makkah-haram.jpg',
]

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState<FeaturedPackage | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePackageClick = (pkg: FeaturedPackage) => {
    setSelectedPackage(pkg)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedPackage(null), 300) // Delay to allow modal animation
  }

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
            onPackageClick={handlePackageClick}
          />

          {/* New & Most Popular Tours */}
          <PackageCarousel
            title="New &amp; Most Popular Tours"
            packages={getPopularPackages()}
            onPackageClick={handlePackageClick}
            reverse
          />

          {/* Top Destinations */}
          <PackageCarousel
            title="Top Destinations"
            packages={getTopDestinationPackages()}
            onPackageClick={handlePackageClick}
          />

          {/* Family Destinations */}
          <PackageCarousel
            title="Family Destinations"
            packages={getFamilyPackages()}
            onPackageClick={handlePackageClick}
            reverse
          />
        </div>
      </section>

      {/* Package Details Modal */}
      <PackageDetailsModal
        package={selectedPackage}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

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

