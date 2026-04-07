'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type CountUpNumberProps = {
  value: number
  durationMs?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

function formatNumber(value: number, decimals: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function CountUpNumber({
  value,
  durationMs = 1200,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [display, setDisplay] = useState(0)

  const formattedFinal = useMemo(() => {
    return `${prefix}${formatNumber(value, decimals)}${suffix}`
  }, [decimals, prefix, suffix, value])

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    let raf = 0
    const start = performance.now()
    const from = 0
    const to = value

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(1, Math.max(0, elapsed / durationMs))
      const eased = 1 - Math.pow(1 - t, 3)
      const current = from + (to - from) * eased
      setDisplay(current)

      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [durationMs, hasStarted, value])

  return (
    <span ref={ref} className={className} aria-label={formattedFinal}>
      {prefix}
      {formatNumber(display, decimals)}
      {suffix}
    </span>
  )
}
