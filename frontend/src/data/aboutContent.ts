export type AboutStat = {
  value: string
  label: string
}

export type AboutQuote = {
  id: string
  quote: string
  context: string
}

export const aboutMarketStats: AboutStat[] = [
  { value: '$235B+', label: 'Global Halal Travel Market' },
  { value: '9.1%', label: 'Annual Growth Rate' },
  { value: '10%', label: 'Global Tourism Share by 2025' },
  { value: '$300B', label: 'Projected Spend by 2026' },
]

export const aboutBrandQuotes: AboutQuote[] = [
  {
    id: 'about-vision',
    quote:
      "Our vision is to become the world's leading platform for Halal tourism, offering comprehensive Halal-friendly travel solutions.",
    context: 'Our Vision',
  },
  {
    id: 'about-mission',
    quote:
      'We are committed to setting and promoting the highest standards for Halal tourism, with trusted and respectful travel experiences.',
    context: 'Our Mission',
  },
  {
    id: 'about-opportunity',
    quote:
      'Halal tourism is among the fastest-growing global sectors, with Muslim travelers expected to spend $300 billion by 2026.',
    context: 'Market Opportunity',
  },
]
