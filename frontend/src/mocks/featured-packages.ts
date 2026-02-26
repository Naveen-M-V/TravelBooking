// Mock data for featured packages on landing page

export interface FeaturedPackage {
  id: string
  name: string
  destination: string
  country: string
  duration: string
  price: number
  currency: string
  originalPrice?: number
  image: string
  halalRating: number
  rating?: number
  reviews?: number
  features: string[]
  category: 'best' | 'popular' | 'top-destination' | 'family'
  description: string
  highlights: string[]
  included: string[]
  itinerary: {
    day: number
    title: string
    description: string
    activities: string[]
  }[]
}

export const featuredPackages: FeaturedPackage[] = [
  // Our Best Tour Packages
  {
    id: 'pkg-001',
    name: 'Makkah & Madinah Spiritual Journey',
    destination: 'Makkah & Madinah',
    country: 'Saudi Arabia',
    duration: '10 Days / 9 Nights',
    price: 8500,
    originalPrice: 9500,
    currency: 'SAR',
    image: '/images/packages/makkah-madinah.jpg',
    halalRating: 5,
    rating: 4.9,
    reviews: 324,
    features: ['Prayer Facilities', 'Halal Food', 'Alcohol-Free', 'Family Friendly'],
    category: 'best',
    description: 'Experience the ultimate spiritual journey with our premium Umrah package including 5-star accommodation near Haram.',
    highlights: [
      'Direct view of Kaaba from hotel',
      'Expert spiritual guide included',
      'Ziyarat tours to historical sites',
      'Private transportation',
      'Buffet halal meals'
    ],
    included: [
      'Round-trip flights',
      '9 nights accommodation (5 Makkah, 4 Madinah)',
      'Daily breakfast and dinner',
      'Airport transfers',
      'Ziyarat tours',
      'Travel insurance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Jeddah - Transfer to Makkah',
        description: 'Arrive at King Abdulaziz International Airport and transfer to your 5-star hotel near Haram.',
        activities: ['Airport pickup', 'Hotel check-in', 'Evening Umrah']
      },
      {
        day: 2,
        title: 'Makkah - Spiritual Activities',
        description: 'Full day for worship and spiritual activities at Masjid al-Haram.',
        activities: ['Fajr prayer at Haram', 'Tawaf and Sai', 'Zamzam water collection', 'Evening prayers']
      },
      {
        day: 3,
        title: 'Makkah - Historical Ziyarat',
        description: 'Guided tour of historical Islamic sites in Makkah.',
        activities: ['Cave of Hira', 'Jabal al-Nour', 'Jannat al-Mualla cemetery', 'Museum of the Two Holy Mosques']
      }
    ]
  },
  {
    id: 'pkg-002',
    name: 'Istanbul Byzantine & Ottoman Heritage',
    destination: 'Istanbul',
    country: 'Turkey',
    duration: '7 Days / 6 Nights',
    price: 4200,
    originalPrice: 5200,
    currency: 'SAR',
    image: '/images/packages/istanbul.jpg',
    halalRating: 5,
    rating: 4.8,
    reviews: 256,
    features: ['Mosques Nearby', 'Halal Food', 'Shopping', 'Historical Sites'],
    category: 'best',
    description: 'Discover the rich Islamic history of Istanbul with visits to magnificent mosques and Ottoman palaces.',
    highlights: [
      'Blue Mosque and Hagia Sophia visits',
      'Topkapi Palace tour',
      'Bosphorus cruise',
      'Grand Bazaar shopping',
      'Traditional Turkish bath experience'
    ],
    included: [
      'Round-trip flights',
      '6 nights 4-star hotel',
      'Daily breakfast',
      'All guided tours',
      'Entry fees to attractions',
      'Private transfers'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Istanbul',
        description: 'Welcome to Istanbul! Transfer to your hotel in Sultanahmet district.',
        activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner', 'Evening walk in Sultanahmet']
      },
      {
        day: 2,
        title: 'Historical Peninsula Tour',
        description: 'Explore the heart of Byzantine and Ottoman history.',
        activities: ['Blue Mosque', 'Hagia Sophia', 'Topkapi Palace', 'Basilica Cistern']
      }
    ]
  },
  {
    id: 'pkg-003',
    name: 'Dubai Luxury & Desert Safari',
    destination: 'Dubai',
    country: 'UAE',
    duration: '5 Days / 4 Nights',
    price: 3800,
    currency: 'SAR',
    image: '/images/packages/dubai.jpg',
    halalRating: 5,
    rating: 4.7,
    reviews: 189,
    features: ['Luxury Hotels', 'Halal Food', 'Family Entertainment', 'Desert Safari'],
    category: 'best',
    description: 'Experience the perfect blend of luxury, culture, and adventure in the jewel of the Middle East.',
    highlights: [
      'Burj Khalifa At The Top experience',
      'Desert safari with BBQ dinner',
      'Dubai Mall shopping',
      'Dubai Marina cruise',
      'Visit to Jumeirah Mosque'
    ],
    included: [
      'Round-trip flights',
      '4 nights 5-star hotel',
      'Daily breakfast and one dinner',
      'Desert safari',
      'City tour with guide',
      'All transfers'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Welcome to Dubai',
        description: 'Arrive in Dubai and settle into your luxury hotel.',
        activities: ['Airport pickup', 'Hotel check-in', 'Evening at Dubai Marina', 'Dhow cruise dinner']
      }
    ]
  },
  {
    id: 'pkg-004',
    name: 'Malaysia Islamic Heritage & Nature',
    destination: 'Kuala Lumpur & Penang',
    country: 'Malaysia',
    duration: '8 Days / 7 Nights',
    price: 4500,
    currency: 'SAR',
    image: '/images/packages/malaysia.jpg',
    halalRating: 5,
    rating: 4.8,
    reviews: 201,
    features: ['Halal Food Paradise', 'Mosques', 'Nature', 'Shopping'],
    category: 'best',
    description: 'Explore Malaysia\'s Islamic heritage combined with stunning natural beauty and world-class halal cuisine.',
    highlights: [
      'National Mosque visit',
      'Batu Caves spiritual site',
      'Penang street food tour',
      'Cameron Highlands tea plantations',
      'Islamic Arts Museum'
    ],
    included: [
      'Round-trip flights',
      '7 nights accommodation',
      'Daily breakfast',
      'Internal flights',
      'All guided tours',
      'Travel insurance'
    ],
    itinerary: []
  },

  // New & Most Popular Tours
  {
    id: 'pkg-005',
    name: 'Morocco Imperial Cities Explorer',
    destination: 'Casablanca, Fez, Marrakech',
    country: 'Morocco',
    duration: '9 Days / 8 Nights',
    price: 5200,
    currency: 'SAR',
    image: '/images/packages/morocco.jpg',
    halalRating: 5,
    rating: 4.9,
    reviews: 142,
    features: ['Islamic Architecture', 'Halal Food', 'Sahara Desert', 'Souks'],
    category: 'popular',
    description: 'Journey through Morocco\'s imperial cities and experience authentic Islamic culture and architecture.',
    highlights: [
      'Hassan II Mosque visit',
      'Fez Medina exploration',
      'Sahara desert overnight',
      'Marrakech Jemaa el-Fnaa',
      'Traditional Moroccan cuisine'
    ],
    included: [
      'Round-trip flights',
      '8 nights accommodation',
      'Daily breakfast and 4 dinners',
      'Desert camp experience',
      'All guided tours',
      'Internal transfers'
    ],
    itinerary: []
  },
  {
    id: 'pkg-006',
    name: 'Egypt Pyramids & Islamic Cairo',
    destination: 'Cairo & Luxor',
    country: 'Egypt',
    duration: '7 Days / 6 Nights',
    price: 3900,
    currency: 'SAR',
    image: '/images/packages/egypt.jpg',
    halalRating: 4,
    rating: 4.6,
    reviews: 178,
    features: ['Historical Sites', 'Islamic Monuments', 'Nile Cruise', 'Museums'],
    category: 'popular',
    description: 'Discover ancient wonders and Islamic heritage in the land of pharaohs.',
    highlights: [
      'Great Pyramids & Sphinx',
      'Egyptian Museum',
      'Islamic Cairo mosques',
      'Nile cruise dinner',
      'Valley of the Kings'
    ],
    included: [
      'Round-trip flights',
      '6 nights hotels',
      'Daily breakfast and 2 dinners',
      'All entry fees',
      'Expert Egyptologist guide',
      'Nile cruise'
    ],
    itinerary: []
  },
  {
    id: 'pkg-007',
    name: 'Jordan Petra & Wadi Rum Adventure',
    destination: 'Amman, Petra, Wadi Rum',
    country: 'Jordan',
    duration: '6 Days / 5 Nights',
    price: 4800,
    currency: 'SAR',
    image: '/images/packages/jordan.jpg',
    halalRating: 5,
    rating: 4.8,
    reviews: 167,
    features: ['Ancient Sites', 'Desert Adventure', 'Halal Food', 'Dead Sea'],
    category: 'popular',
    description: 'Experience the Rose City of Petra and sleep under the stars in Wadi Rum desert.',
    highlights: [
      'Petra archaeological site',
      'Wadi Rum desert camp',
      'Dead Sea floating experience',
      'Jerash Roman ruins',
      'Amman citadel'
    ],
    included: [
      'Round-trip flights',
      '5 nights accommodation',
      'Daily breakfast and 3 dinners',
      'Desert camp night',
      'All tours with guide',
      'Entry tickets'
    ],
    itinerary: []
  },
  {
    id: 'pkg-008',
    name: 'Azerbaijan Silk Road Heritage',
    destination: 'Baku',
    country: 'Azerbaijan',
    duration: '5 Days / 4 Nights',
    price: 3200,
    currency: 'SAR',
    image: '/images/packages/azerbaijan.jpg',
    halalRating: 4,
    rating: 4.7,
    reviews: 98,
    features: ['Modern City', 'Old Town', 'Halal Food', 'Caspian Sea'],
    category: 'popular',
    description: 'Explore the land of fire where East meets West along the ancient Silk Road.',
    highlights: [
      'Old City Baku (Icherisheher)',
      'Flame Towers view',
      'Gobustan rock art',
      'Caspian Sea boulevard',
      'Heydar Mosque'
    ],
    included: [
      'Round-trip flights',
      '4 nights 4-star hotel',
      'Daily breakfast',
      'City tours',
      'All transfers',
      'Visa assistance'
    ],
    itinerary: []
  },

  // Top Destinations
  {
    id: 'pkg-009',
    name: 'Bali Paradise Beach & Culture',
    destination: 'Bali',
    country: 'Indonesia',
    duration: '7 Days / 6 Nights',
    price: 4100,
    currency: 'SAR',
    image: '/images/packages/bali.jpg',
    halalRating: 4,
    rating: 4.8,
    reviews: 234,
    features: ['Beach Resort', 'Halal Food', 'Spa', 'Nature'],
    category: 'top-destination',
    description: 'Relax in tropical paradise with halal-friendly resorts and stunning beaches.',
    highlights: [
      'Uluwatu Temple sunset',
      'Ubud rice terraces',
      'Beach resort stay',
      'Traditional spa treatment',
      'Halal Indonesian cuisine'
    ],
    included: [
      'Round-trip flights',
      '6 nights beach resort',
      'Daily breakfast',
      'Island tours',
      'Spa session',
      'Airport transfers'
    ],
    itinerary: []
  },
  {
    id: 'pkg-010',
    name: 'Spain Andalusia Muslim Heritage',
    destination: 'Granada, Cordoba, Seville',
    country: 'Spain',
    duration: '8 Days / 7 Nights',
    price: 5800,
    currency: 'SAR',
    image: '/images/packages/spain.jpg',
    halalRating: 3,
    rating: 4.7,
    reviews: 156,
    features: ['Islamic Heritage', 'Architecture', 'History', 'Culture'],
    category: 'top-destination',
    description: 'Walk through the magnificent Islamic monuments of Al-Andalus.',
    highlights: [
      'Alhambra Palace Granada',
      'Mezquita-Catedral Cordoba',
      'Alcazar of Seville',
      'Flamenco show',
      'Tapas tour (halal options)'
    ],
    included: [
      'Round-trip flights',
      '7 nights hotels',
      'Daily breakfast',
      'Fast-track entries',
      'Expert guide',
      'High-speed train tickets'
    ],
    itinerary: []
  },
  {
    id: 'pkg-011',
    name: 'Bosnia Herzegovina Hidden Gem',
    destination: 'Sarajevo & Mostar',
    country: 'Bosnia Herzegovina',
    duration: '6 Days / 5 Nights',
    price: 3400,
    currency: 'SAR',
    image: '/images/packages/bosnia.jpg',
    halalRating: 5,
    rating: 4.9,
    reviews: 189,
    features: ['Ottoman Heritage', 'Natural Beauty', 'Halal Food', 'Budget Friendly'],
    category: 'top-destination',
    description: 'Discover Europe\'s best-kept secret with stunning Ottoman architecture and warm hospitality.',
    highlights: [
      'Mostar Old Bridge',
      'Sarajevo Bascarsija',
      'Gazi Husrev-beg Mosque',
      'Bosnian cuisine',
      'Kravica Waterfalls'
    ],
    included: [
      'Round-trip flights',
      '5 nights accommodation',
      'Daily breakfast',
      'All tours with guide',
      'Entry fees',
      'Transfers'
    ],
    itinerary: []
  },
  {
    id: 'pkg-012',
    name: 'Thailand Bangkok & Islands',
    destination: 'Bangkok & Phuket',
    country: 'Thailand',
    duration: '7 Days / 6 Nights',
    price: 3700,
    currency: 'SAR',
    image: '/images/packages/thailand.jpg',
    halalRating: 3,
    rating: 4.6,
    reviews: 221,
    features: ['City & Beach', 'Halal Food', 'Shopping', 'Island Hopping'],
    category: 'top-destination',
    description: 'Experience vibrant Bangkok and pristine beaches with halal dining options.',
    highlights: [
      'Grand Palace Bangkok',
      'Floating markets',
      'Phi Phi Islands tour',
      'Thai cooking class (halal)',
      'Beach relaxation'
    ],
    included: [
      'Round-trip flights',
      '6 nights accommodation',
      'Daily breakfast',
      'Island tours',
      'Domestic flight',
      'All transfers'
    ],
    itinerary: []
  },

  // Family Destinations
  {
    id: 'pkg-013',
    name: 'Singapore Family Fun Adventure',
    destination: 'Singapore',
    country: 'Singapore',
    duration: '5 Days / 4 Nights',
    price: 4500,
    currency: 'SAR',
    image: '/images/packages/singapore.jpg',
    halalRating: 5,
    rating: 4.9,
    reviews: 312,
    features: ['Family Friendly', 'Halal Food Heaven', 'Safe', 'Theme Parks'],
    category: 'family',
    description: 'Perfect family destination with world-class attractions and excellent halal food options.',
    highlights: [
      'Universal Studios Singapore',
      'Gardens by the Bay',
      'Sentosa Island',
      'Singapore Zoo',
      'Halal food paradise'
    ],
    included: [
      'Round-trip flights',
      '4 nights family hotel',
      'Daily breakfast',
      'Theme park tickets',
      'City tour',
      'All transfers'
    ],
    itinerary: []
  },
  {
    id: 'pkg-014',
    name: 'Maldives Family Beach Resort',
    destination: 'Male & Resort Island',
    country: 'Maldives',
    duration: '6 Days / 5 Nights',
    price: 7200,
    currency: 'SAR',
    image: '/images/packages/maldives.jpg',
    halalRating: 5,
    rating: 4.9,
    reviews: 267,
    features: ['Beach Resort', 'Family Villas', 'Halal Food', 'Water Sports'],
    category: 'family',
    description: 'Luxury family beach resort with private villas and all-inclusive halal dining.',
    highlights: [
      'Private family villa',
      'All-inclusive halal meals',
      'Kids club activities',
      'Snorkeling & diving',
      'Sunset fishing trip'
    ],
    included: [
      'Round-trip flights',
      '5 nights beach villa',
      'All meals included',
      'Water sports',
      'Kids activities',
      'Speedboat transfers'
    ],
    itinerary: []
  },
  {
    id: 'pkg-015',
    name: 'Turkey Family Discovery Tour',
    destination: 'Istanbul & Cappadocia',
    country: 'Turkey',
    duration: '8 Days / 7 Nights',
    price: 5500,
    currency: 'SAR',
    image: '/images/packages/turkey-family.jpg',
    halalRating: 5,
    rating: 4.8,
    reviews: 198,
    features: ['Family Friendly', 'Adventure', 'History', 'Hot Air Balloon'],
    category: 'family',
    description: 'Exciting family adventure through Turkey\'s most iconic destinations.',
    highlights: [
      'Hot air balloon ride Cappadocia',
      'Underground cities',
      'Bosphorus cruise',
      'Turkish ice cream experience',
      'Family-friendly hotels'
    ],
    included: [
      'Round-trip flights',
      '7 nights family rooms',
      'Daily breakfast and 3 dinners',
      'All tours with family guide',
      'Balloon ride',
      'Internal flights'
    ],
    itinerary: []
  },
  {
    id: 'pkg-016',
    name: 'Qatar Doha Family Experience',
    destination: 'Doha',
    country: 'Qatar',
    duration: '4 Days / 3 Nights',
    price: 3600,
    currency: 'SAR',
    image: '/images/packages/qatar.jpg',
    halalRating: 5,
    rating: 4.7,
    reviews: 145,
    features: ['Modern City', 'Family Entertainment', 'Desert Safari', 'Museums'],
    category: 'family',
    description: 'Short family getaway to futuristic Doha with perfect blend of culture and entertainment.',
    highlights: [
      'Museum of Islamic Art',
      'Katara Cultural Village',
      'Desert safari with kids',
      'Souq Waqif traditional market',
      'The Pearl Qatar'
    ],
    included: [
      'Round-trip flights',
      '3 nights 5-star hotel',
      'Daily breakfast',
      'Desert safari',
      'City tour',
      'All transfers'
    ],
    itinerary: []
  },

  // --- Additional Best Packages ---
  {
    id: 'pkg-017',
    name: 'Oman Muscat & Nizwa Cultural Escape',
    destination: 'Muscat & Nizwa',
    country: 'Oman',
    duration: '6 Days / 5 Nights',
    price: 3900,
    originalPrice: 4500,
    currency: 'SAR',
    image: '/images/packages/oman.jpg',
    halalRating: 5,
    rating: 4.8,
    reviews: 211,
    features: ['Halal Food', 'Desert Safari', 'Historic Forts', 'Souqs'],
    category: 'best',
    description: 'Explore the most authentic Arabian peninsula experience with majestic forts, wadis, and traditional Omani hospitality.',
    highlights: [
      'Grand Mosque Muscat',
      'Nizwa Fort & Souq',
      'Wadi Shab adventure',
      'Wahiba Sands dunes',
      'Traditional Omani cuisine'
    ],
    included: [
      'Round-trip flights',
      '5 nights hotels',
      'Daily breakfast',
      'Desert camp experience',
      'All guided tours',
      'Private driver'
    ],
    itinerary: []
  },
  {
    id: 'pkg-018',
    name: 'Pakistan Heritage Circuit',
    destination: 'Lahore & Islamabad',
    country: 'Pakistan',
    duration: '7 Days / 6 Nights',
    price: 2800,
    currency: 'SAR',
    image: '/images/packages/pakistan.jpg',
    halalRating: 5,
    rating: 4.7,
    reviews: 178,
    features: ['Mughal History', 'Halal Food', 'Hospitality', 'Mosques'],
    category: 'best',
    description: "Discover Pakistan's rich Islamic heritage — from Lahore's magnificent Mughal monuments to Islamabad's Faisal Mosque.",
    highlights: [
      'Badshahi Mosque Lahore',
      'Lahore Fort & Shalimar Gardens',
      'Faisal Mosque Islamabad',
      'Lahore Food Street',
      'Taxila Buddhist ruins'
    ],
    included: [
      'Round-trip flights',
      '6 nights boutique hotels',
      'Daily breakfast and 3 dinners',
      'All tours with guide',
      'Internal flights',
      'Travel insurance'
    ],
    itinerary: []
  },

  // --- Additional Popular Packages ---
  {
    id: 'pkg-019',
    name: 'Uzbekistan Silk Road Journey',
    destination: 'Samarkand & Bukhara',
    country: 'Uzbekistan',
    duration: '8 Days / 7 Nights',
    price: 4700,
    originalPrice: 5300,
    currency: 'SAR',
    image: '/images/packages/uzbekistan.jpg',
    halalRating: 5,
    rating: 4.9,
    reviews: 134,
    features: ['Islamic Architecture', 'Ancient Silk Road', 'Halal Food', 'UNESCO Sites'],
    category: 'popular',
    description: 'Walk the legendary Silk Road through Samarkand and Bukhara, marvelling at some of the most stunning Islamic architecture in the world.',
    highlights: [
      'Registan Square Samarkand',
      'Shah-i-Zinda necropolis',
      'Bukhara Old City',
      'Kalon Minaret',
      'Traditional Uzbek pilaf'
    ],
    included: [
      'Round-trip flights',
      '7 nights hotels',
      'Daily breakfast and 4 dinners',
      'High-speed train tickets',
      'All guided tours',
      'Visa support'
    ],
    itinerary: []
  },
  {
    id: 'pkg-020',
    name: 'Kosovo & Albania Hidden Gems',
    destination: 'Pristina & Tirana',
    country: 'Kosovo / Albania',
    duration: '6 Days / 5 Nights',
    price: 3100,
    currency: 'SAR',
    image: '/images/packages/kosovo.jpg',
    halalRating: 5,
    rating: 4.7,
    reviews: 89,
    features: ['Ottoman Heritage', 'Budget Friendly', 'Halal Food', 'Off The Beaten Path'],
    category: 'popular',
    description: 'Discover two of Europe\'s most underrated Muslim-majority countries full of Ottoman history and stunning Balkan landscapes.',
    highlights: [
      'Pristina mosque & bazaar',
      'Prizren Ottoman old town',
      'Tirana colourful capital',
      'Berat UNESCO castle town',
      'Albanian Riviera beaches'
    ],
    included: [
      'Round-trip flights',
      '5 nights accommodation',
      'Daily breakfast',
      'All guided tours',
      'Inter-country bus',
      'Visa assistance'
    ],
    itinerary: []
  },

  // --- Additional Top Destination Packages ---
  {
    id: 'pkg-021',
    name: 'Maldives Luxury Overwater Escape',
    destination: 'North Malé Atoll',
    country: 'Maldives',
    duration: '5 Days / 4 Nights',
    price: 6800,
    originalPrice: 7900,
    currency: 'SAR',
    image: '/images/packages/maldives-luxury.jpg',
    halalRating: 5,
    rating: 5.0,
    reviews: 298,
    features: ['Overwater Bungalow', 'All-Inclusive', 'Halal Dining', 'Diving'],
    category: 'top-destination',
    description: 'Unwind in an overwater villa surrounded by the turquoise Indian Ocean with fully halal all-inclusive dining.',
    highlights: [
      'Private overwater bungalow',
      'All-inclusive halal meals',
      'Sunset dolphin cruise',
      'Coral reef snorkelling',
      'Couples spa treatment'
    ],
    included: [
      'Round-trip flights',
      '4 nights overwater bungalow',
      'All meals and soft drinks',
      'Seaplane transfers',
      'Snorkelling gear',
      'Daily guided activities'
    ],
    itinerary: []
  },
  {
    id: 'pkg-022',
    name: 'Bosnia Emerald Landscapes & Heritage',
    destination: 'Sarajevo, Mostar & Una',
    country: 'Bosnia Herzegovina',
    duration: '7 Days / 6 Nights',
    price: 3800,
    currency: 'SAR',
    image: '/images/packages/bosnia-nature.jpg',
    halalRating: 5,
    rating: 4.9,
    reviews: 163,
    features: ['Nature & Adventure', 'Ottoman Heritage', 'Halal Food', 'River Rafting'],
    category: 'top-destination',
    description: 'Combine Sarajevo\'s Ottoman charm with the emerald rivers of Una National Park and the iconic Mostar bridge.',
    highlights: [
      'Mostar Stari Most bridge',
      'Sarajevo Bascarsija',
      'Una National Park rafting',
      'Blagaj Tekke monastery',
      'Traditional Bosnian food'
    ],
    included: [
      'Round-trip flights',
      '6 nights guesthouses',
      'Daily breakfast and 3 dinners',
      'Rafting experience',
      'All tours with guide',
      'Transfers'
    ],
    itinerary: []
  },

  // --- Additional Family Packages ---
  {
    id: 'pkg-023',
    name: 'Türkiye Antalya Family Beach Holiday',
    destination: 'Antalya & Side',
    country: 'Turkey',
    duration: '7 Days / 6 Nights',
    price: 4200,
    originalPrice: 4900,
    currency: 'SAR',
    image: '/images/packages/antalya.jpg',
    halalRating: 5,
    rating: 4.8,
    reviews: 342,
    features: ['All-Inclusive', 'Beach Resort', 'Kids Club', 'Water Park'],
    category: 'family',
    description: 'Perfect family beach holiday on the stunning Turquoise Coast with all-inclusive halal-friendly resorts and activities for all ages.',
    highlights: [
      'Beachfront all-inclusive resort',
      'On-site waterpark',
      'Supervised kids club',
      'Boat trip to Sunken City',
      'Aspendos Roman theatre'
    ],
    included: [
      'Round-trip flights',
      '6 nights all-inclusive resort',
      'All meals and snacks',
      'Kids club access',
      'Water park entry',
      'Airport transfers'
    ],
    itinerary: []
  },
  {
    id: 'pkg-024',
    name: 'Malaysia Langkawi Family Adventure',
    destination: 'Langkawi',
    country: 'Malaysia',
    duration: '6 Days / 5 Nights',
    price: 3500,
    currency: 'SAR',
    image: '/images/packages/langkawi.jpg',
    halalRating: 5,
    rating: 4.7,
    reviews: 217,
    features: ['Family Beach', 'Halal Food', 'Cable Car', 'Island Hopping'],
    category: 'family',
    description: 'Tropical family paradise with pristine beaches, cable car adventures, and some of the best halal seafood in Asia.',
    highlights: [
      'SkyCab cable car panorama',
      'Underwater World aquarium',
      'Island hopping tour',
      'Mangrove boat safari',
      'Halal seafood feast'
    ],
    included: [
      'Round-trip flights',
      '5 nights beach resort',
      'Daily breakfast',
      'Island hopping tour',
      'Cable car tickets',
      'All transfers'
    ],
    itinerary: []
  }
]

// Helper functions to get packages by category
export const getBestPackages = () => 
  featuredPackages.filter(pkg => pkg.category === 'best')

export const getPopularPackages = () => 
  featuredPackages.filter(pkg => pkg.category === 'popular')

export const getTopDestinationPackages = () => 
  featuredPackages.filter(pkg => pkg.category === 'top-destination')

export const getFamilyPackages = () => 
  featuredPackages.filter(pkg => pkg.category === 'family')

export const getPackageById = (id: string) => 
  featuredPackages.find(pkg => pkg.id === id)
