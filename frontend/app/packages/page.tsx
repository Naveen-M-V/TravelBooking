'use client'

import { useState } from 'react'
import { PackageResultCard } from '@/components/packages/PackageResultCard'
import { EnquiryFormModal } from '@/components/packages/EnquiryFormModal'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, SlidersHorizontal, MapPin, Star, Calendar } from 'lucide-react'
import { mockPackages } from '@/data/mockPackages'

export default function PackagesPage() {
  const [packages, setPackages] = useState(mockPackages)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedHalalRatings, setSelectedHalalRatings] = useState<number[]>([])
  const [sortBy, setSortBy] = useState('recommended')
  const [showFilters, setShowFilters] = useState(true)
  const [enquiryPackage, setEnquiryPackage] = useState<any>(null)

  const locations = Array.from(new Set(mockPackages.map(p => p.location)))
  
  const filteredPackages = packages
    .filter(pkg => {
      const withinPrice = pkg.price.total >= priceRange[0] && pkg.price.total <= priceRange[1]
      const matchLocation = selectedLocations.length === 0 || selectedLocations.includes(pkg.location)
      const matchRating = selectedRatings.length === 0 || selectedRatings.some(r => pkg.rating >= r)
      const matchHalal = selectedHalalRatings.length === 0 || selectedHalalRatings.includes(pkg.halalRating)
      return withinPrice && matchLocation && matchRating && matchHalal
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price.total - b.price.total
        case 'price-high': return b.price.total - a.price.total
        case 'rating': return b.rating - a.rating
        case 'halal': return b.halalRating - a.halalRating
        default: return 0
      }
    })

  const handleSelectPackage = (pkg: any) => {
    setEnquiryPackage(pkg)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Halal Holiday Packages</h1>
          <p className="text-xl opacity-90">Discover amazing destinations with complete peace of mind</p>
          <div className="mt-6 flex gap-4 text-sm">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2">
              <MapPin className="h-4 w-4 mr-2" />
              {locations.length} Destinations
            </Badge>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2">
              <Star className="h-4 w-4 mr-2 fill-white" />
              100% Halal-Friendly
            </Badge>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2">
              <Calendar className="h-4 w-4 mr-2" />
              Flexible Booking
            </Badge>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <p className="text-sm text-gray-600">
                {filteredPackages.length} packages found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating: High to Low</SelectItem>
                  <SelectItem value="halal">Halal Rating: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </h3>

                  {/* Price Range */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-3 block">
                      Price Range (SAR)
                    </label>
                    <Slider
                      min={0}
                      max={10000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{priceRange[0]} SAR</span>
                      <span>{priceRange[1]} SAR</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-3 block">Location</label>
                    <div className="space-y-2">
                      {locations.map(location => (
                        <div key={location} className="flex items-center space-x-2">
                          <Checkbox
                            id={location}
                            checked={selectedLocations.includes(location)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedLocations([...selectedLocations, location])
                              } else {
                                setSelectedLocations(selectedLocations.filter(l => l !== location))
                              }
                            }}
                          />
                          <label htmlFor={location} className="text-sm cursor-pointer">
                            {location}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-3 block">Star Rating</label>
                    <div className="space-y-2">
                      {[5, 4, 3].map(rating => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox
                            id={`rating-${rating}`}
                            checked={selectedRatings.includes(rating)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRatings([...selectedRatings, rating])
                              } else {
                                setSelectedRatings(selectedRatings.filter(r => r !== rating))
                              }
                            }}
                          />
                          <label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center gap-1">
                            {Array.from({ length: rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="ml-1">& up</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Halal Rating */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-3 block">Halal Rating</label>
                    <div className="space-y-2">
                      {[5, 4, 3].map(rating => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox
                            id={`halal-${rating}`}
                            checked={selectedHalalRatings.includes(rating)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedHalalRatings([...selectedHalalRatings, rating])
                              } else {
                                setSelectedHalalRatings(selectedHalalRatings.filter(r => r !== rating))
                              }
                            }}
                          />
                          <label htmlFor={`halal-${rating}`} className="text-sm cursor-pointer">
                            {rating} Stars
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setPriceRange([0, 10000])
                      setSelectedLocations([])
                      setSelectedRatings([])
                      setSelectedHalalRatings([])
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? "lg:col-span-9" : "lg:col-span-12"}>
            <div className="space-y-6">
              {filteredPackages.map(pkg => (
                <PackageResultCard
                  key={pkg.id}
                  package={pkg}
                  onSelect={handleSelectPackage}
                />
              ))}

              {filteredPackages.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-gray-500 mb-4">No packages found matching your filters</p>
                  <Button onClick={() => {
                    setPriceRange([0, 10000])
                    setSelectedLocations([])
                    setSelectedRatings([])
                    setSelectedHalalRatings([])
                  }}>
                    Clear Filters
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {enquiryPackage && (
        <EnquiryFormModal
          package={enquiryPackage}
          isOpen={!!enquiryPackage}
          onClose={() => setEnquiryPackage(null)}
        />
      )}
    </div>
  )
}
