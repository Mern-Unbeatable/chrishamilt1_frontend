import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import {
  initScrollAnimations,
  shouldRunScrollAnimations,
  subscribeScrollAnimationBreakpoint,
} from '@/lib/scrollAnimations'
import { scrollToTop } from '@/helpers/scrollToTop'

export default function ScrollAnimationProvider({ children }) {
  const containerRef = useRef(null)
  const contextRef = useRef(null)
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    const root = containerRef.current
    if (!root) return undefined

    const refresh = () => {
      ScrollTrigger.refresh()
      if (!hash) scrollToTop()
    }

    const teardown = () => {
      contextRef.current?.revert()
      contextRef.current = null
    }

    const setup = () => {
      teardown()

      if (!shouldRunScrollAnimations()) return

      contextRef.current = gsap.context(() => {
        initScrollAnimations(root)
      }, root)

      requestAnimationFrame(refresh)
    }

    setup()

    const unsubscribeBreakpoint = subscribeScrollAnimationBreakpoint(() => {
      setup()
    })

    window.addEventListener('load', refresh)

    return () => {
      unsubscribeBreakpoint()
      window.removeEventListener('load', refresh)
      teardown()
    }
  }, [pathname, hash])

  return <div ref={containerRef}>{children}</div>
}
