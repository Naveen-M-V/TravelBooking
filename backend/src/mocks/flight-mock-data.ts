/**
 * Mock flight data — used when ALMOSAFER_CLIENT_ID is not set in .env
 * Provides realistic results so the frontend can be fully tested without API credentials.
 */

export const MOCK_SEARCH_ID = 'mock-sId-dev-12345678'

export const MOCK_SEGMENTS = [
  {
    id: 'seg-001',
    origin: 'DXB',
    destination: 'LHR',
    departureDate: '2026-04-15T08:00:00',
    arrivalDate: '2026-04-15T12:30:00',
    durationMinutes: 450,
    flightCode: 'EK001',
    airline: 'EK',
    operator: 'EK',
  },
  {
    id: 'seg-002',
    origin: 'LHR',
    destination: 'DXB',
    departureDate: '2026-04-15T14:00:00',
    arrivalDate: '2026-04-15T00:30:00+1',
    durationMinutes: 390,
    flightCode: 'EK002',
    airline: 'EK',
    operator: 'EK',
  },
  {
    id: 'seg-003',
    origin: 'DXB',
    destination: 'IST',
    departureDate: '2026-04-15T09:30:00',
    arrivalDate: '2026-04-15T13:00:00',
    durationMinutes: 270,
    flightCode: 'FZ503',
    airline: 'FZ',
    operator: 'FZ',
  },
  {
    id: 'seg-004',
    origin: 'IST',
    destination: 'LHR',
    departureDate: '2026-04-15T15:00:00',
    arrivalDate: '2026-04-15T17:30:00',
    durationMinutes: 210,
    flightCode: 'TK1979',
    airline: 'TK',
    operator: 'TK',
  },
  {
    id: 'seg-005',
    origin: 'DXB',
    destination: 'LHR',
    departureDate: '2026-04-15T21:30:00',
    arrivalDate: '2026-04-16T02:00:00',
    durationMinutes: 450,
    flightCode: 'QR001',
    airline: 'QR',
    operator: 'QR',
  },
  {
    id: 'seg-006',
    origin: 'DXB',
    destination: 'MAN',
    departureDate: '2026-04-15T06:00:00',
    arrivalDate: '2026-04-15T11:15:00',
    durationMinutes: 435,
    flightCode: 'EK019',
    airline: 'EK',
    operator: 'EK',
  },
]

export const MOCK_FARE_INFO = [
  {
    id: 'fare-001',
    cabin: 'ECONOMY',
    availability: 9,
    fareBasis: 'YOW',
    fareFamilyName: 'Flex',
    baggage: { id: 'bag-001', checkInWeight: 23, checkInUnit: 'KG', cabinWeight: 7, cabinUnit: 'KG' },
  },
  {
    id: 'fare-002',
    cabin: 'ECONOMY',
    availability: 4,
    fareBasis: 'YOWSAVER',
    fareFamilyName: 'Saver',
    baggage: { id: 'bag-002', checkInWeight: 20, checkInUnit: 'KG', cabinWeight: 7, cabinUnit: 'KG' },
  },
]

export const MOCK_ITINERARIES = [
  {
    id: 'itin-001',
    airline: 'EK',
    price: { total: 1850, base: 1600, tax: 250, currency: 'SAR' },
    flights: [
      {
        flightIndex: 0,
        id: 'flight-001',
        segmentsReference: [{ segmentIndex: 0, segmentRef: 'seg-001', fareInfoRef: 'fare-001' }],
        stopDetails: [],
      },
    ],
    hasFareFamilies: true,
    direction: 'OUTBOUND',
    airlineGroup: 'EK',
  },
  {
    id: 'itin-002',
    airline: 'EK',
    price: { total: 2200, base: 1900, tax: 300, currency: 'SAR' },
    flights: [
      {
        flightIndex: 0,
        id: 'flight-002',
        segmentsReference: [{ segmentIndex: 0, segmentRef: 'seg-001', fareInfoRef: 'fare-002' }],
        stopDetails: [],
      },
    ],
    hasFareFamilies: true,
    direction: 'OUTBOUND',
    airlineGroup: 'EK',
  },
  {
    id: 'itin-003',
    airline: 'QR',
    price: { total: 1650, base: 1420, tax: 230, currency: 'SAR' },
    flights: [
      {
        flightIndex: 0,
        id: 'flight-003',
        segmentsReference: [{ segmentIndex: 0, segmentRef: 'seg-005', fareInfoRef: 'fare-001' }],
        stopDetails: [],
      },
    ],
    hasFareFamilies: true,
    direction: 'OUTBOUND',
    airlineGroup: 'QR',
  },
  {
    id: 'itin-004',
    airline: 'FZ',
    price: { total: 980, base: 850, tax: 130, currency: 'SAR' },
    flights: [
      {
        flightIndex: 0,
        id: 'flight-004',
        segmentsReference: [
          { segmentIndex: 0, segmentRef: 'seg-003', fareInfoRef: 'fare-002' },
          { segmentIndex: 1, segmentRef: 'seg-004', fareInfoRef: 'fare-002' },
        ],
        stopDetails: [{ airport: 'IST', durationMinutes: 120, type: 'TRANSIT', position: 'BETWEEN', segmentRef: 'seg-003' }],
      },
    ],
    hasFareFamilies: false,
    direction: 'OUTBOUND',
    airlineGroup: 'FZ',
  },
  {
    id: 'itin-005',
    airline: 'TK',
    price: { total: 1120, base: 950, tax: 170, currency: 'SAR' },
    flights: [
      {
        flightIndex: 0,
        id: 'flight-005',
        segmentsReference: [
          { segmentIndex: 0, segmentRef: 'seg-003', fareInfoRef: 'fare-001' },
          { segmentIndex: 1, segmentRef: 'seg-004', fareInfoRef: 'fare-001' },
        ],
        stopDetails: [{ airport: 'IST', durationMinutes: 90, type: 'TRANSIT', position: 'BETWEEN', segmentRef: 'seg-003' }],
      },
    ],
    hasFareFamilies: true,
    direction: 'OUTBOUND',
    airlineGroup: 'TK',
  },
  {
    id: 'itin-006',
    airline: 'EK',
    price: { total: 2900, base: 2550, tax: 350, currency: 'SAR' },
    flights: [
      {
        flightIndex: 0,
        id: 'flight-006',
        segmentsReference: [{ segmentIndex: 0, segmentRef: 'seg-006', fareInfoRef: 'fare-001' }],
        stopDetails: [],
      },
    ],
    hasFareFamilies: true,
    direction: 'OUTBOUND',
    airlineGroup: 'EK',
  },
  {
    id: 'itin-007',
    airline: 'QR',
    price: { total: 3450, base: 3100, tax: 350, currency: 'SAR' },
    flights: [
      {
        flightIndex: 0,
        id: 'flight-007',
        segmentsReference: [{ segmentIndex: 0, segmentRef: 'seg-005', fareInfoRef: 'fare-001' }],
        stopDetails: [],
      },
    ],
    hasFareFamilies: true,
    direction: 'OUTBOUND',
    airlineGroup: 'QR',
  },
  {
    id: 'itin-008',
    airline: 'FZ',
    price: { total: 820, base: 710, tax: 110, currency: 'SAR' },
    flights: [
      {
        flightIndex: 0,
        id: 'flight-008',
        segmentsReference: [{ segmentIndex: 0, segmentRef: 'seg-003', fareInfoRef: 'fare-002' }],
        stopDetails: [],
      },
    ],
    hasFareFamilies: false,
    direction: 'OUTBOUND',
    airlineGroup: 'FZ',
  },
]

/** Full mock polling response matching the shape the frontend expects */
export function buildMockPollingResponse(sId: string) {
  return {
    status: 'COMPLETED',
    itineraries: MOCK_ITINERARIES,
    segments: MOCK_SEGMENTS,
    fareInfo: MOCK_FARE_INFO,
    meta: {
      sId,
      totalResults: MOCK_ITINERARIES.length,
      currency: 'SAR',
    },
  }
}
