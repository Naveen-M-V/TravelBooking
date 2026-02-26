/**
 * Frontend mock flight data — used as fallback when backend is not running.
 */

export const MOCK_ITINERARIES = [
  {
    id: 'itin-001',
    airline: 'Emirates',
    price: { total: 1850, base: 1600, tax: 250, currency: 'SAR' },
    flights: [],
    hasFareFamilies: true,
    direction: 'OUTBOUND',
    airlineGroup: 'EK',
    legs: [{ stops: 0, duration: 450, origin: 'DXB', destination: 'LHR', departure: '2026-04-15T08:00:00', arrival: '2026-04-15T12:30:00', flightNumber: 'EK001' }],
  },
  {
    id: 'itin-002',
    airline: 'Qatar Airways',
    price: { total: 1650, base: 1420, tax: 230, currency: 'SAR' },
    flights: [],
    hasFareFamilies: true,
    direction: 'OUTBOUND',
    airlineGroup: 'QR',
    legs: [{ stops: 0, duration: 420, origin: 'DXB', destination: 'LHR', departure: '2026-04-15T21:30:00', arrival: '2026-04-16T02:00:00', flightNumber: 'QR001' }],
  },
  {
    id: 'itin-003',
    airline: 'flydubai',
    price: { total: 980, base: 850, tax: 130, currency: 'SAR' },
    flights: [],
    hasFareFamilies: false,
    direction: 'OUTBOUND',
    airlineGroup: 'FZ',
    legs: [
      { stops: 1, duration: 540, origin: 'DXB', destination: 'LHR', departure: '2026-04-15T09:30:00', arrival: '2026-04-15T19:00:00', flightNumber: 'FZ503', stopAirport: 'IST' },
    ],
  },
  {
    id: 'itin-004',
    airline: 'Turkish Airlines',
    price: { total: 1120, base: 950, tax: 170, currency: 'SAR' },
    flights: [],
    hasFareFamilies: true,
    direction: 'OUTBOUND',
    airlineGroup: 'TK',
    legs: [
      { stops: 1, duration: 510, origin: 'DXB', destination: 'LHR', departure: '2026-04-15T06:00:00', arrival: '2026-04-15T16:30:00', flightNumber: 'TK1979', stopAirport: 'IST' },
    ],
  },
  {
    id: 'itin-005',
    airline: 'Emirates',
    price: { total: 2200, base: 1900, tax: 300, currency: 'SAR' },
    flights: [],
    hasFareFamilies: true,
    direction: 'OUTBOUND',
    airlineGroup: 'EK',
    legs: [{ stops: 0, duration: 450, origin: 'DXB', destination: 'LHR', departure: '2026-04-15T14:00:00', arrival: '2026-04-15T18:30:00', flightNumber: 'EK003' }],
  },
  {
    id: 'itin-006',
    airline: 'Emirates',
    price: { total: 2900, base: 2550, tax: 350, currency: 'SAR' },
    flights: [],
    hasFareFamilies: true,
    direction: 'OUTBOUND',
    airlineGroup: 'EK',
    legs: [{ stops: 0, duration: 435, origin: 'DXB', destination: 'MAN', departure: '2026-04-15T06:00:00', arrival: '2026-04-15T11:15:00', flightNumber: 'EK019' }],
  },
  {
    id: 'itin-007',
    airline: 'Qatar Airways',
    price: { total: 3450, base: 3100, tax: 350, currency: 'SAR' },
    flights: [],
    hasFareFamilies: true,
    direction: 'OUTBOUND',
    airlineGroup: 'QR',
    legs: [{ stops: 0, duration: 420, origin: 'DXB', destination: 'LHR', departure: '2026-04-15T23:00:00', arrival: '2026-04-16T03:30:00', flightNumber: 'QR003' }],
  },
  {
    id: 'itin-008',
    airline: 'flydubai',
    price: { total: 820, base: 710, tax: 110, currency: 'SAR' },
    flights: [],
    hasFareFamilies: false,
    direction: 'OUTBOUND',
    airlineGroup: 'FZ',
    legs: [
      { stops: 1, duration: 600, origin: 'DXB', destination: 'LHR', departure: '2026-04-15T03:00:00', arrival: '2026-04-15T15:00:00', flightNumber: 'FZ701', stopAirport: 'AMM' },
    ],
  },
]

export function getMockSearchResults(origin: string, destination: string) {
  // Personalise origin/destination in mock legs
  return MOCK_ITINERARIES.map(itin => ({
    ...itin,
    legs: itin.legs.map(leg => ({ ...leg, origin, destination })),
  }))
}
