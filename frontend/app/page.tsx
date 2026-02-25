'use client'

import { useState } from 'react'
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

      {/* Featured Packages Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">Discover Amazing Packages</h2>
            <p className="text-gray-600 text-lg">
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
            title="New & Most Popular Tours"
            packages={getPopularPackages()}
            onPackageClick={handlePackageClick}
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
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Plan Your Next Trip?
          </h2>
          <p className="text-lg mb-8 text-primary-100">
            Join thousands of Muslim travelers who trust Halal Travels for their journey
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary-50 active:scale-95 active:translate-y-0 active:bg-white">
              Create Account
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:bg-white/10 active:scale-95 active:translate-y-0 active:bg-white/20">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

