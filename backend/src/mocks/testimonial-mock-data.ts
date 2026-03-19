export type PublicTestimonial = {
  id: string
  quote: string
  name: string
  city: string
  rating: number
}

export const testimonialMockData: PublicTestimonial[] = [
  {
    id: 't-001',
    quote:
      'Finally, a platform that genuinely understands Muslim travelers. The halal meal and prayer-friendly options made our trip stress-free.',
    name: 'Amira K.',
    city: 'London, UK',
    rating: 5,
  },
  {
    id: 't-002',
    quote:
      'Our family holiday was smooth from start to finish. Hotels, dining, and activities were all aligned with our values.',
    name: 'Yusuf A.',
    city: 'Toronto, Canada',
    rating: 5,
  },
  {
    id: 't-003',
    quote:
      'Booking felt premium and transparent. It is refreshing to have a modern halal-focused travel platform we can trust.',
    name: 'Fatima R.',
    city: 'Dubai, UAE',
    rating: 5,
  },
  {
    id: 't-004',
    quote:
      'I appreciated how easy it was to compare halal-friendly options and plan everything in one place.',
    name: 'Imran S.',
    city: 'Kuala Lumpur, MY',
    rating: 4.8,
  },
  {
    id: 't-005',
    quote:
      'Excellent support team and very clear package details. We felt confident throughout the process.',
    name: 'Sana M.',
    city: 'Riyadh, SA',
    rating: 4.9,
  },
]
