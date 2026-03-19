import { aboutBrandQuotes } from '@/data/aboutContent'
import type { Testimonial } from '@/lib/api/testimonials'

export const testimonialFallbackMockData: Testimonial[] = aboutBrandQuotes.map((item, index) => ({
  id: item.id,
  quote: item.quote,
  name: 'Halal Travels Club',
  city: item.context,
  rating: 5 - index * 0.1,
}))
