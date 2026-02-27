// Real tour package data sourced from Halal Travels Club (halaltravelsclub.com)

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

  //  BEST PACKAGES 

  {
    id: 'pkg-001',
    name: 'Best of Spain – 7 Nights 8 Days',
    destination: 'Madrid  Toledo  Seville  Granada  Barcelona',
    country: 'Spain',
    duration: '8 Days / 7 Nights',
    price: 8500,
    originalPrice: 9500,
    currency: 'SAR',
    image: 'https://picsum.photos/seed/spain-plaza-espana-seville/800/600',
    halalRating: 4,
    features: ['Halal Food', 'Private Guided Tours', 'Alhambra Palace', 'Mosque of Córdoba', 'Escorted Group Tour'],
    category: 'best',
    description: "An immersive 8-day journey through Spain's most iconic cities — Madrid, Toledo, Córdoba, Seville, Granada, Valencia, and Barcelona — with halal dining, private guides, and the legendary Alhambra Palace.",
    highlights: [
      'Guided tour of the Alhambra Palace & Generalife Gardens, Granada',
      'Visit to the Grand Mosque (Mezquita-Catedral) of Córdoba',
      'Private evening walking tour of Madrid — Gran Vía, Royal Palace, Plaza Mayor',
      "Historic city tour of Toledo, Spain's ancient former capital",
      'Barcelona panoramic tour — Gothic Quarter & Cathedral of Santa Eulalia',
    ],
    included: [
      'Return international flights',
      '7 nights hotel accommodation across Madrid, Seville, Granada & Barcelona',
      'Daily halal breakfast',
      'Private airport transfers (Madrid arrival & Barcelona departure)',
      'Expert private guides in Madrid & Barcelona',
      'Escorted group coach travel: Madrid  Córdoba  Seville  Granada  Valencia  Barcelona',
      'Guided Alhambra Palace entrance',
      'Travel insurance',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Madrid',
        description: 'Your private driver meets you at Madrid Airport. Evening panoramic walking tour of the city centre — Gran Vía, Plaza de España, Royal Palace, Plaza Mayor and Puerta del Sol.',
        activities: ['Private airport transfer', 'Hotel check-in', 'Evening tour: Gran Vía, Plaza de España, Royal Palace, Plaza Mayor, Puerta del Sol'],
      },
      {
        day: 2,
        title: 'Day Trip to Toledo',
        description: 'Full day in Toledo — UNESCO World Heritage city and former capital of Spain, celebrated for its layers of Christian, Islamic, and Jewish history.',
        activities: ['Breakfast at hotel', 'Guided tour of Plaza del Ayuntamiento', 'Gothic Cathedral exterior', 'Ancient city walls walk', 'Free time for lunch & shopping in the Bazaars', 'Return to Madrid'],
      },
      {
        day: 3,
        title: 'Madrid  Córdoba  Seville',
        description: 'Depart with the escorted group by coach. Visit the magnificent Mezquita of Córdoba and stroll through the historic Jewish Quarter, then continue to Seville.',
        activities: ['Breakfast & check-out', 'Coach from Madrid', 'Guided Mezquita tour, Córdoba', 'Old Jewish Quarter walk', 'Arrival in Seville', 'Hotel check-in', 'Included halal dinner'],
      },
      {
        day: 4,
        title: 'Seville City Tour',
        description: "Morning guided city tour of Seville's most celebrated landmarks. The afternoon is free for leisure or optional excursions.",
        activities: ['Breakfast', 'María Luisa Park visit', 'Plaza de España panoramic tour', 'Great Cathedral & Santa Cruz Quarter exteriors', 'Afternoon at leisure', 'Included halal dinner'],
      },
      {
        day: 5,
        title: 'Seville  Granada & The Alhambra',
        description: 'Travel to Granada and explore the legendary Alhambra Palace — once the residence of the Moorish kings — along with the Generalife Gardens.',
        activities: ['Breakfast & check-out', 'Coach to Granada', 'Guided Alhambra Palace tour', 'Generalife Gardens walk', 'Hotel check-in', 'Included halal dinner'],
      },
      {
        day: 6,
        title: 'Granada  Valencia',
        description: 'Depart Granada via scenic mountain roads to the Mediterranean coast. Arrive Valencia with the afternoon free.',
        activities: ['Breakfast & check-out', 'Scenic coach via Guadix, Baza & Puerto Lumbreras', 'Arrival in Valencia', 'Hotel check-in', 'Free afternoon to explore the city'],
      },
      {
        day: 7,
        title: 'Valencia  Barcelona',
        description: 'Free morning in Valencia, then coach to Barcelona. In the evening your private guide leads you through the Gothic Quarter and Las Ramblas.',
        activities: ['Breakfast', 'Free morning in Valencia', 'Coach to Barcelona', 'Private hotel transfer', 'Evening tour: Las Ramblas, Gothic Quarter, Cathedral of Santa Eulalia'],
      },
      {
        day: 8,
        title: 'Barcelona & Departure',
        description: 'Final breakfast, check out, and private transfer to Barcelona Airport.',
        activities: ['Breakfast', 'Check-out', 'Private transfer to Barcelona Airport'],
      },
    ],
  },

  {
    id: 'pkg-002',
    name: 'Greece – 6 Nights 7 Days',
    destination: 'Athens  Chalkida  Nafplio  Cape Sounion',
    country: 'Greece',
    duration: '7 Days / 6 Nights',
    price: 6200,
    originalPrice: 7200,
    currency: 'SAR',
    image: 'https://picsum.photos/seed/athens-acropolis-greece/800/600',
    halalRating: 5,
    features: ['Halal Full-Board', 'Islamic Heritage Sites', 'Ottoman Mosques & Castles', 'Private Guided Tours'],
    category: 'best',
    description: "Discover Greece's remarkable Islamic heritage — the Grand Mosque of Athens, Ottoman castles, historic mosques, and the Acropolis — on a fully halal full-board escorted private tour.",
    highlights: [
      'Grand Mosque & Islamic Center of Athens — built with full Greek government support',
      'Benaki Islamic Heritage Museum — unique in Europe and the world',
      'Karababa Islamic Ottoman Castle & Emir Zade Mosque (1458), Chalkida',
      'Historical mosques of Nafplio and Plamidi Ottoman Castle',
      'Sunset visit to the Acropolis and Parthenon',
      'Exclusive halal dinner at the gate of Al Fatih Mosque, Athens',
    ],
    included: [
      'Return international flights',
      '6 nights hotel accommodation in Athens',
      'Exclusive halal full-board throughout (breakfast, lunch & dinner)',
      'Private airport transfers',
      'Expert private guided tours daily',
      'Entrance fees: Acropolis, Benaki Museum, Karababa Castle',
      'Exclusive halal dinner at Al Fatih Mosque gate',
      'Halal sunset dinner at Cape Sounion viewpoint',
      'Travel insurance',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Athens',
        description: 'Transfer from Athens Airport to your hotel. Overnight in Athens.',
        activities: ['Airport transfer', 'Hotel check-in', 'Rest & refresh'],
      },
      {
        day: 2,
        title: 'Grand Mosque of Athens & Benaki Islamic Museum',
        description: 'Panoramic Athens tour, Grand Mosque & Islamic Center visit, and the Benaki Islamic Heritage Museum — unique in the world.',
        activities: ['Halal full-board', 'Panoramic Athens city tour', 'Grand Mosque & Islamic Center of Athens', 'Meet & Greet with local Muslim community', 'Benaki Islamic Heritage Museum', 'Halal dinner'],
      },
      {
        day: 3,
        title: 'Chalkida – Karababa Castle & Emir Zade Mosque  Acropolis Sunset',
        description: 'Day trip to Chalkida for the Ottoman Karababa Castle and the historic Emir Zade Mosque (1458), then a breathtaking sunset visit to the Acropolis.',
        activities: ['Halal full-board', 'Drive to Chalkida', 'Karababa Islamic Ottoman Castle', 'Emir Zade Mosque (built 1458)', 'Halal riverside lunch', 'Acropolis & Parthenon sunset visit', 'Halal dinner in Athens'],
      },
      {
        day: 4,
        title: 'Athens Mosques & Monastiraki',
        description: 'Athens Trilogy landmarks, ancient Monastiraki Mosque, Al Fatih Mosque and its 15th-century Quran Madrassa. Exclusive halal dinner at the mosque gate.',
        activities: ['Halal full-board', 'Parliament & changing of the guards', 'Athens Trilogy panoramic tour', 'Monastiraki Mosque', 'Al Fatih Mosque & Quran Madrassa (1458)', 'Monastiraki & Plaka district free time', 'Exclusive halal dinner at Al Fatih Mosque gate'],
      },
      {
        day: 5,
        title: 'Corinth Canal, Sultan Ahmed Mosque & Nafplio',
        description: 'Corinth Canal, hilltop Sultan Ahmed Mosque (1458), and the sea-side city of Nafplio with its grand 15th-century mosques and Plamidi Ottoman Castle.',
        activities: ['Halal full-board', 'Corinth Canal visit', 'Sultan Ahmed Mosque hilltop (built 1458)', 'Nafplio sea-side halal lunch', 'Two historical mosques of Nafplio', 'Plamidi Islamic Ottoman Castle', 'Return to Athens'],
      },
      {
        day: 6,
        title: 'Athens Mall Shopping & Temple of Poseidon Sunset',
        description: 'Morning luxury shopping, then an awe-inspiring visit to the Temple of Poseidon at Cape Sounion followed by a halal dinner overlooking the Aegean sunset.',
        activities: ['Halal full-board', 'The Mall Athens shopping', 'Luxury brand district', 'Cape Sounion drive', 'Temple of Poseidon visit', 'Halal dinner with Aegean sunset panorama'],
      },
      {
        day: 7,
        title: 'McArthur Glen Outlet & Departure',
        description: 'Final shopping at McArthur Glen Designer Fashion Outlet before transfer to Athens Airport.',
        activities: ['Halal breakfast', 'McArthur Glen Designer Outlet visit', 'Transfer to Athens Airport', 'Departure'],
      },
    ],
  },

  //  POPULAR PACKAGES 

  {
    id: 'pkg-003',
    name: 'Hola Barcelona – 4 Nights 3 Days',
    destination: 'Barcelona  Montserrat',
    country: 'Spain',
    duration: '5 Days / 4 Nights',
    price: 4200,
    originalPrice: 5000,
    currency: 'SAR',
    image: 'https://picsum.photos/seed/barcelona-sagrada-familia/800/600',
    halalRating: 4,
    features: ['Halal Food', 'Private Tours', 'Gaudí Architecture', 'Montserrat Day Trip', 'Gothic Quarter'],
    category: 'popular',
    description: "A vibrant city escape to Barcelona — Gaudí's masterpieces, the Gothic Quarter, a cable-car ride to Montserrat Monastery, and a free day to explore, with halal dining throughout.",
    highlights: [
      'Private guided sightseeing tour of Barcelona',
      "Sagrada Família — Gaudí's iconic basilica",
      'Casa Batlló & La Pedrera on the famous Paseo de Gràcia',
      'Day trip to Montserrat Mountains & Monastery by cable car',
      'Evening panoramic tour: Las Ramblas, Gothic Quarter, Cathedral',
    ],
    included: [
      'Return international flights',
      '4 nights hotel accommodation in Barcelona',
      'Daily halal breakfast',
      'Private airport transfers (arrival & departure)',
      'Expert private guide for Day 2 city tour',
      'Day trip to Montserrat with cable car or cog train ride',
      'Travel insurance',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Barcelona',
        description: 'Private transfer, hotel check-in. Evening walking tour of Las Ramblas, Gothic Quarter, and the Cathedral of Santa Eulalia.',
        activities: ['Private airport transfer', 'Hotel check-in', 'Evening tour: Las Ramblas, Gothic Quarter, Cathedral of Santa Eulalia'],
      },
      {
        day: 2,
        title: 'Barcelona City Tour',
        description: "Full day guided — Gaudí's masterpieces, Montjuïc panorama, and the vibrant waterfront.",
        activities: ['Halal breakfast', 'Paseo de Gràcia: Casa Batlló & La Pedrera', 'Sagrada Família visit', 'Panoramic drive through Plaza España', 'Montjuïc Mountain ascent (cable car optional)', 'Barceloneta district & Arc de Triomf'],
      },
      {
        day: 3,
        title: 'Montserrat Mountains & Monastery',
        description: 'Dramatic day trip to Montserrat — cable car or cog train to the monastery and breathtaking mountain scenery.',
        activities: ['Halal breakfast', 'Transfer to Montserrat', 'Cable car or cog train ride to monastery', 'Guided panoramic monastery tour', 'Mountain free time', 'Return to Barcelona'],
      },
      {
        day: 4,
        title: 'Free Day in Barcelona',
        description: 'Full free day — explore at your own pace, enjoy shopping, or ask us to arrange an optional excursion.',
        activities: ['Halal breakfast', 'Full free day at leisure', 'Optional: Park Güell, Tibidabo, stadium tour, shopping'],
      },
      {
        day: 5,
        title: 'Departure',
        description: 'Final breakfast, check out, and private transfer to Barcelona Airport.',
        activities: ['Halal breakfast', 'Check-out', 'Private transfer to Barcelona Airport'],
      },
    ],
  },

  {
    id: 'pkg-004',
    name: 'Enchanting Sri Lanka – Day Odyssey of Wonders',
    destination: 'Nuwara Eliya  Beruwala  Galle  Colombo',
    country: 'Sri Lanka',
    duration: '6 Nights / 5 Days',
    price: 5200,
    originalPrice: 6000,
    currency: 'SAR',
    image: 'https://picsum.photos/seed/srilanka-tea-plantation-nuwara/800/600',
    halalRating: 4,
    features: ['Halal Food', 'Islamic Heritage', 'Tea Trails & Beaches', 'UNESCO World Heritage', 'Boat Safari'],
    category: 'popular',
    description: "Experience Sri Lanka — the Pearl of the Indian Ocean. From misty tea plantations and Sri Lanka's oldest mosque to golden beaches, Galle Fort, and vibrant Colombo. Ayubowan!",
    highlights: [
      'Bluefield Tea Factory tour & tasting in Nuwara Eliya',
      "Beruwala — birthplace of Sri Lanka's Muslim community",
      'Galle Fort — UNESCO World Heritage Site with Tuk-Tuk ride',
      'Masjid Al Abrar — the oldest mosque in Sri Lanka',
      'Scenic coastal train ride along the Indian Ocean',
      'Red Mosque, Pettah Bazaar & Lotus Tower in Colombo',
    ],
    included: [
      'Return international flights',
      '6 nights accommodation (Nuwara Eliya, Beruwala x3, Colombo x2)',
      'Daily halal breakfast',
      'Private airport transfers',
      'Private guided tours throughout',
      'Madhu River Boat Safari & Cinnamon Island visit',
      'Scenic Indian Ocean coastal train ride',
      'Seafood halal dinner at Negombo beach',
      'Travel insurance',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival  Nuwara Eliya ("Little England")',
        description: "Welcome to Sri Lanka — 'Ayubowan!' Scenic highland drive from the airport, stopping at Bluefield Tea Factory for a tea tasting and Ramboda Waterfalls.",
        activities: ['Airport arrival transfer', 'Bluefield Tea Factory tour & tasting', 'Ramboda Waterfalls photo stop', 'Arrive Nuwara Eliya', 'Hotel check-in & rest'],
      },
      {
        day: 2,
        title: 'Gregory Lake  Beruwala Beach',
        description: "Peaceful morning at Gregory Lake, then travel to Beruwala — Sri Lanka's first Muslim settlement. Visit the turtle hatchery, release baby turtles, and enjoy the sunset beach.",
        activities: ['Breakfast', 'Gregory Lake stroll & optional boat ride', 'Drive to Beruwala', 'Turtle Hatchery conservation visit', 'Baby turtle release into the sea', 'Beach leisure & sunset'],
      },
      {
        day: 3,
        title: 'Galle Fort & Moonstone Mines',
        description: 'Explore iconic Galle Fort (UNESCO Heritage) with a Tuk-Tuk ride through its lanes, visit ancient moonstone mines, and watch stilt fishermen.',
        activities: ['Breakfast', 'Drive to Galle', 'Galle Fort guided walk', 'Tuk-Tuk ride through the fort', 'Meetiyagoda moonstone mine visit', 'Stilt fishing experience', 'Return to Beruwala'],
      },
      {
        day: 4,
        title: 'Madhu River Safari, Oldest Mosque & Colombo by Coastal Train',
        description: "Boat safari on Madhu River, Cinnamon Island, Masjid Al Abrar (Sri Lanka's oldest mosque), then a scenic coastal train ride to Colombo.",
        activities: ['Breakfast', 'Madhu River Boat Safari', 'Cinnamon Island visit', 'Masjid Al Abrar (oldest mosque in Sri Lanka)', 'Scenic Indian Ocean coastal train to Colombo'],
      },
      {
        day: 5,
        title: 'Colombo City & Departure',
        description: 'Dhuha prayer at the Red Mosque, Pettah Bazaar markets, Lotus Tower, Galle Face Green, and a final seafood halal dinner before airport transfer.',
        activities: ['Breakfast', 'Dhuha prayer at Red Mosque', 'Pettah Bazaar market walk', 'Lotus Tower photo stop', 'Galle Face Green & local street food', 'Seafood halal dinner at Negombo beach', 'Transfer to airport'],
      },
    ],
  },

  //  TOP DESTINATIONS 

  {
    id: 'pkg-005',
    name: 'Couples Tanzania & Zanzibar Vacation – 11 Nights 12 Days',
    destination: 'Arusha  Serengeti  Ngorongoro  Zanzibar',
    country: 'Tanzania',
    duration: '12 Days / 11 Nights',
    price: 14500,
    originalPrice: 16000,
    currency: 'SAR',
    image: 'https://picsum.photos/seed/tanzania-serengeti-safari/800/600',
    halalRating: 5,
    features: ['Halal Food', 'Luxury Safari Lodges', 'Zanzibar Beach Resort', 'Wildlife Game Drives', 'Maasai Village'],
    category: 'top-destination',
    description: 'The ultimate couples retreat — a luxury Tanzania safari through Serengeti, Tarangire, and Ngorongoro Crater, followed by 5 nights of beach bliss at a luxury Zanzibar resort. Fully halal.',
    highlights: [
      'Tarangire National Park — elephant herds & buffalo game drives',
      'Serengeti National Park — Big Five & big cat spotting',
      "Ngorongoro Crater — world's largest unflooded caldera with black rhinos",
      'Maasai village cultural experience',
      'Luxury white-sand beach resort in Zanzibar — 5 nights',
      'Optional: Hot Air Balloon Safari over the Serengeti ($550 p/p)',
    ],
    included: [
      'Return international flights',
      '11 nights accommodation: luxury safari lodges & Zanzibar beach resort (5 nights)',
      'All halal meals throughout the safari',
      'Halal dining at beach resort',
      'All game drives and national park entrance fees',
      'Maasai village cultural tour',
      'Domestic flight: Arusha  Zanzibar',
      'All airport and inter-hotel transfers',
      'English-speaking expert safari guide',
      'Travel insurance',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Arusha',
        description: 'Transfer from Kilimanjaro International Airport to your luxury hotel in Arusha. Welcomed with refreshing juice and dates.',
        activities: ['Kilimanjaro Airport transfer', 'Check-in at Gran Melia Hotel / Arusha Coffee Lodge', 'Welcome with juice & dates', 'Rest & acclimatise'],
      },
      {
        day: 2,
        title: 'Tarangire National Park – Full Day Game Drive',
        description: 'Full day in scenic Tarangire National Park — famous for its large elephant herds, buffalos, zebras, wildebeests, and giraffes.',
        activities: ['Breakfast', 'Drive to Tarangire National Park', 'Full-day wildlife game viewing', 'Halal picnic or lodge lunch', 'Elephant, giraffe & big game spotting'],
      },
      {
        day: 3,
        title: 'Serengeti via Olduvai Gorge',
        description: "Drive to the Serengeti via Olduvai Gorge — home to early human fossils. Optional Maasai village tour before the afternoon game drive into Tanzania's greatest national park.",
        activities: ['Breakfast', 'Drive to Serengeti via Olduvai Gorge', 'Olduvai Gorge fossil museum', 'Optional Maasai village tour', 'Afternoon Serengeti game drive', 'Check-in at luxury tented camp'],
      },
      {
        day: 4,
        title: 'Serengeti – Full Day Safari',
        description: 'Full day exploring the vast Serengeti plains — lions, cheetahs, leopards, wildebeests, and zebras. Hot halal lodge lunch or a bush picnic.',
        activities: ['Sunrise game drive', 'Big cat spotting: lions, cheetahs, leopards', 'Hot halal lodge lunch or bush picnic', 'Afternoon game drive', 'Sundowners at the camp'],
      },
      {
        day: 5,
        title: 'Serengeti  Ngorongoro',
        description: 'Early half-day of final wildlife viewing in the Serengeti, then depart for the Ngorongoro Conservation Area.',
        activities: ['Early breakfast', 'Half-day Serengeti game viewing', 'Drive to Ngorongoro Conservation Area', 'Game drive en route', 'Check-in Ngorongoro Serena Lodge'],
      },
      {
        day: 6,
        title: 'Ngorongoro Crater',
        description: "Descend into the Ngorongoro Crater — the world's largest unflooded caldera — for black rhinos, hippos, lions, and spotted hyenas. Afternoon Maasai village cultural tour.",
        activities: ['Breakfast', 'Ngorongoro Crater full-day game drive', 'Black rhino, hippo & Big Five spotting', 'Halal crater floor lunch', 'Maasai village cultural tour', 'Drive to Lake Manyara for overnight'],
      },
      {
        day: 7,
        title: 'Lake Manyara  Arusha  Zanzibar',
        description: 'Morning drive to Arusha via the Great Rift Valley. Halal lunch in Arusha, then afternoon flight to Zanzibar and transfer to your beach resort.',
        activities: ['Breakfast', 'Scenic drive via Great Rift Valley', 'Halal lunch in Arusha', 'Flight to Zanzibar (~16:30, arrives ~17:30)', 'Transfer to Zanzibar beach resort'],
      },
      {
        day: 8,
        title: 'Zanzibar Beach Resort (Days 8–11)',
        description: 'Five days of pure relaxation on the white sand beaches of Zanzibar with warm Indian Ocean waters and halal cuisine at your luxury resort.',
        activities: ['Daily halal meals at resort', 'Swimming & beach leisure', 'Snorkelling & watersports (optional)', 'Spice island tour (optional)', 'Sunset dhow cruise (optional)', 'Stone Town exploration (optional)'],
      },
      {
        day: 12,
        title: 'Zanzibar – Departure',
        description: 'Final halal breakfast, resort check-out, and transfer to Zanzibar International Airport.',
        activities: ['Final halal breakfast', 'Resort check-out (by 11:59 AM)', 'Luggage storage available', 'Airport transfer', 'Departure from Zanzibar International Airport'],
      },
    ],
  },

  {
    id: 'pkg-006',
    name: 'Greece – Islamic Heritage Tour',
    destination: 'Athens  Corinth  Nafplio  Cape Sounion',
    country: 'Greece',
    duration: '7 Days / 6 Nights',
    price: 6200,
    currency: 'SAR',
    image: 'https://picsum.photos/seed/greece-athens-mosque-heritage/800/600',
    halalRating: 5,
    features: ['Halal Full-Board', 'Islamic Heritage', 'Ottoman History', 'Private Tours'],
    category: 'top-destination',
    description: "Experience Greece's untold Islamic history — from Ottoman castles and 15th-century mosques to the world's only Islamic museum of its kind, and a breathtaking sunset at the Acropolis.",
    highlights: [
      'Grand Mosque of Athens — built with full Greek government funding',
      'Benaki Islamic Heritage Museum — unique worldwide',
      'Corinth Canal & 600-year-old hilltop Sultan Ahmed Mosque',
      'Acropolis & Parthenon — used as a mosque for 400 years',
      'Exclusive halal dinner arranged at Al Fatih Mosque gate',
    ],
    included: [
      'Return international flights',
      '6 nights hotel in Athens',
      'Exclusive halal full-board',
      'Private guided tours daily',
      'All entrance fees',
      'Halal dinner at Al Fatih Mosque gate',
      'Travel insurance',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Athens',
        description: 'Airport transfer and hotel check-in. Overnight in Athens.',
        activities: ['Airport transfer', 'Hotel check-in'],
      },
      {
        day: 2,
        title: 'Grand Mosque & Benaki Islamic Museum',
        description: 'Visit Athens Grand Mosque — the first officially built in Greece in over 100 years — and the world-class Benaki Islamic Heritage Museum.',
        activities: ['Halal full-board', 'Grand Mosque & Islamic Center of Athens', 'Benaki Islamic Heritage Museum'],
      },
      {
        day: 3,
        title: 'Chalkida – Ottoman Castle & Mosque  Acropolis Sunset',
        description: 'Day trip to Chalkida for the Karababa Ottoman Castle and Emir Zade Mosque (1458), then Athens for the Acropolis sunset.',
        activities: ['Halal full-board', 'Karababa Islamic Ottoman Castle', 'Emir Zade Mosque (1458)', 'Acropolis & Parthenon sunset visit'],
      },
      {
        day: 4,
        title: 'Athens Mosques & Old City',
        description: "Monastiraki Mosque, Al Fatih Mosque with 15th-century Quran Madrassa, and the historic old city. Exclusive halal dinner at the mosque's gate.",
        activities: ['Halal full-board', 'Monastiraki Mosque', 'Al Fatih Mosque & Quran Madrassa', 'Exclusive halal dinner at Al Fatih Mosque gate'],
      },
      {
        day: 5,
        title: 'Corinth Canal, Nafplio Mosques & Ottoman Castle',
        description: 'Corinth Canal, the ancient Sultan Ahmed hilltop Mosque (1458), and Nafplio with its 15th-century mosques and Plamidi Ottoman Castle.',
        activities: ['Halal full-board', 'Corinth Canal', 'Sultan Ahmed Mosque (1458)', 'Nafplio mosques & Plamidi Ottoman Castle'],
      },
      {
        day: 6,
        title: 'Shopping & Temple of Poseidon Sunset',
        description: 'Athens Mall shopping, then a breathtaking visit to the Temple of Poseidon at Cape Sounion with a halal dinner facing the Aegean sunset.',
        activities: ['Halal full-board', 'The Mall Athens shopping', 'Cape Sounion & Temple of Poseidon', 'Halal Aegean sunset dinner'],
      },
      {
        day: 7,
        title: 'McArthur Glen Outlet & Departure',
        description: 'Final shopping at McArthur Glen Designer Fashion Outlet then airport transfer.',
        activities: ['Halal breakfast', 'McArthur Glen Outlet', 'Athens Airport departure'],
      },
    ],
  },

  //  FAMILY PACKAGES 

  {
    id: 'pkg-007',
    name: 'Enchanting Sri Lanka – Family Edition',
    destination: 'Nuwara Eliya  Beruwala  Galle  Colombo',
    country: 'Sri Lanka',
    duration: '6 Nights / 5 Days',
    price: 5200,
    originalPrice: 6000,
    currency: 'SAR',
    image: 'https://picsum.photos/seed/srilanka-galle-fort-family/800/600',
    halalRating: 4,
    features: ['Halal Food', 'Family Friendly', 'Beach & Wildlife', 'Islamic Heritage', 'UNESCO Heritage'],
    category: 'family',
    description: "A perfect family adventure across Sri Lanka — cool tea highlands, releasing baby turtles into the sea, Tuk-Tuk rides through Galle Fort, a river boat safari, and vibrant Colombo.",
    highlights: [
      'Tea plantation tour — children experience how Ceylon tea is made',
      'Turtle hatchery: release baby turtles into the ocean',
      'Galle Fort Tuk-Tuk ride — a family favourite',
      'Madhu River Boat Safari spotting monkeys and water monitors',
      'Masjid Al Abrar — oldest mosque in Sri Lanka',
      'Lotus Tower and Pettah Bazaar, Colombo',
    ],
    included: [
      'Return international flights',
      '6 nights family hotel accommodation',
      'Daily halal breakfast',
      'Private airport transfers',
      'Private guided tours throughout',
      'Turtle hatchery visit & baby turtle release',
      'Madhu River Boat Safari',
      'Tuk-Tuk ride in Galle Fort',
      'Seafood halal dinner at Negombo beach',
      'Travel insurance',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival  Nuwara Eliya',
        description: 'Scenic highland drive with tea factory tour and waterfall photo stop.',
        activities: ['Airport transfer', 'Bluefield Tea Factory tour & tasting', 'Ramboda Waterfalls photo stop', 'Hotel check-in in Nuwara Eliya'],
      },
      {
        day: 2,
        title: 'Gregory Lake & Beruwala',
        description: 'Boat ride on Gregory Lake, turtle hatchery visit, baby turtle release into the sea, and a beach sunset.',
        activities: ['Breakfast', 'Gregory Lake boat ride', 'Turtle Hatchery conservation visit', 'Baby turtle release into the sea', 'Beach leisure & sunset'],
      },
      {
        day: 3,
        title: 'Galle Fort Adventure',
        description: 'Tuk-Tuk rides through Galle Fort lanes, moonstone mine visit, and stilt fishing show.',
        activities: ['Breakfast', 'Galle Fort guided walk', 'Tuk-Tuk ride through the fort', 'Moonstone mine visit', 'Stilt fishing experience'],
      },
      {
        day: 4,
        title: 'Madhu River Safari & Colombo by Coastal Train',
        description: 'Boat safari spotting monkeys and water monitors, Cinnamon Island, oldest mosque, then the scenic coastal train to Colombo.',
        activities: ['Breakfast', 'Madhu River Boat Safari', 'Cinnamon Island visit', 'Masjid Al Abrar (oldest mosque)', 'Scenic Indian Ocean coastal train to Colombo'],
      },
      {
        day: 5,
        title: 'Colombo & Departure',
        description: 'Morning mosque prayer, Pettah market, Lotus Tower, Galle Face Green, and a final seafood halal dinner at Negombo beach before departure.',
        activities: ['Breakfast', 'Dhuha prayer at Red Mosque', 'Pettah Bazaar walk', 'Lotus Tower photo stop', 'Galle Face Green', 'Seafood halal dinner at Negombo beach', 'Airport transfer'],
      },
    ],
  },

  {
    id: 'pkg-008',
    name: 'Hola Barcelona – Family Break',
    destination: 'Barcelona  Montserrat',
    country: 'Spain',
    duration: '5 Days / 4 Nights',
    price: 4200,
    originalPrice: 5000,
    currency: 'SAR',
    image: 'https://picsum.photos/seed/barcelona-park-guell-family/800/600',
    halalRating: 4,
    features: ['Halal Food', 'Family Friendly', 'Gaudí Architecture', 'Montserrat Cable Car', 'Gothic Quarter'],
    category: 'family',
    description: "An action-packed family city break in Barcelona — Gaudí's magical buildings, a cable-car adventure to Montserrat Monastery, a free day for the family, and halal dining throughout.",
    highlights: [
      "Sagrada Família — Gaudí's awe-inspiring basilica",
      'Casa Batlló & La Pedrera on the famous Paseo de Gràcia',
      'Montserrat Mountain cable car ride — stunning family experience',
      'Gothic Quarter evening walking tour',
      'Las Ramblas and Barcelona waterfront',
    ],
    included: [
      'Return international flights',
      '4 nights hotel accommodation in Barcelona',
      'Daily halal breakfast',
      'Private airport transfers',
      'Expert private guide for city tour (Day 2)',
      'Montserrat day trip with cable car or cog train',
      'Travel insurance',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Barcelona',
        description: 'Private transfer, hotel check-in, and an evening walking tour of the Gothic Quarter and Las Ramblas.',
        activities: ['Private airport transfer', 'Hotel check-in', 'Evening walk: Las Ramblas, Gothic Quarter, Cathedral of Santa Eulalia'],
      },
      {
        day: 2,
        title: 'Gaudí Masterpieces & City Tour',
        description: "Full guided day — Sagrada Família, Casa Batlló, La Pedrera, Montjuïc panorama, and the waterfront.",
        activities: ['Halal breakfast', 'Sagrada Família visit', 'Paseo de Gràcia: Casa Batlló & La Pedrera', 'Montjuïc Mountain & city panorama', 'Barceloneta & Arc de Triomf'],
      },
      {
        day: 3,
        title: 'Montserrat Mountains',
        description: 'Dramatic day trip to Montserrat — cable car or cog train to the monastery and mountain viewpoints.',
        activities: ['Halal breakfast', 'Transfer to Montserrat', 'Cable car or cog train ride', 'Monastery guided tour', 'Mountain free time', 'Return to Barcelona'],
      },
      {
        day: 4,
        title: 'Free Day in Barcelona',
        description: 'Full free day — Park Güell, beaches, shopping, or a Camp Nou stadium tour.',
        activities: ['Halal breakfast', 'Free day at leisure', 'Optional: Park Güell, Tibidabo, Camp Nou, shopping'],
      },
      {
        day: 5,
        title: 'Departure',
        description: 'Final breakfast, check out, and private transfer to Barcelona Airport.',
        activities: ['Halal breakfast', 'Check-out', 'Private transfer to Barcelona Airport'],
      },
    ],
  },

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