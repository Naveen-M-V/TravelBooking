'use client'

import { useMemo } from 'react'
import { CountUpNumber } from '@/components/ui/count-up-number'

type StatItem = {
  value: string
  label: string
}

type ParsedValue = {
  value: number
  prefix: string
  suffix: string
  decimals: number
}

function parseStatValue(raw: string): ParsedValue {
  const trimmed = raw.trim()

  const prefixMatch = trimmed.match(/^[^0-9\-]+/)
  const prefix = prefixMatch ? prefixMatch[0] : ''

  const suffixMatch = trimmed.match(/[^0-9.\-]+$/)
  const suffix = suffixMatch ? suffixMatch[0] : ''

  const numeric = trimmed.replace(prefix, '').replace(suffix, '')
  const decimals = numeric.includes('.') ? numeric.split('.')[1]?.length ?? 0 : 0

  const value = Number(numeric)
  return { value: Number.isFinite(value) ? value : 0, prefix, suffix, decimals }
}

export function MarketStatsStrip({ stats }: { stats: StatItem[] }) {
  const parsed = useMemo(() => stats.map((s) => ({ ...s, parsed: parseStatValue(s.value) })), [stats])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
      {parsed.map((item) => (
        <div
          key={item.label}
          className="relative rounded-2xl bg-white/70 backdrop-blur-sm border border-neutral-200/70 px-4 py-6 md:px-6 md:py-7 shadow-sm"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-300/70 to-transparent" />
          <CountUpNumber
            value={item.parsed.value}
            decimals={item.parsed.decimals}
            prefix={item.parsed.prefix}
            suffix={item.parsed.suffix}
            className="block text-3xl sm:text-4xl md:text-5xl font-bold leading-none text-primary-500"
          />
          <p className="mt-2 text-xs sm:text-sm text-neutral-700/80 leading-snug">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  )
}
