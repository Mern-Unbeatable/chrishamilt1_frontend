import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { initScrollAnimations } from '@/lib/scrollAnimations'
import { scrollToTop } from '@/helpers/scrollToTop'

export default function ScrollAnimationProvider({ children }) {
  const containerRef = useRef(null)
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    const root = containerRef.current
    if (!root) return undefined

    const ctx = gsap.context(() => {
      initScrollAnimations(root)
    }, root)

    const refresh = () => {
      ScrollTrigger.refresh()
      if (!hash) scrollToTop()
    }
    requestAnimationFrame(refresh)
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [pathname, hash])

  return <div ref={containerRef}>{children}</div>
}
