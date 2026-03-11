'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('main section, main [data-reveal]')
    )

    if (!targets.length) return

    targets.forEach((el, index) => {
      el.classList.add('reveal-on-scroll')
      el.style.setProperty('--reveal-delay', `${Math.min(index * 60, 420)}ms`)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    )

    targets.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [pathname])

  return null
}
