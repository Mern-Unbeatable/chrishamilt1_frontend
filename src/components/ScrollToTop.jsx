import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import { scrollToHash } from '@/helpers/scrollToHash'
import { disableBrowserScrollRestoration, scrollToTop } from '@/helpers/scrollToTop'

export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation()

  useLayoutEffect(() => {
    disableBrowserScrollRestoration()
  }, [])

  useLayoutEffect(() => {
    if (hash) {
      let attempts = 0
      let timeoutId

      const tryScroll = () => {
        if (scrollToHash(hash, 'auto')) return

        attempts += 1
        if (attempts < 12) {
          timeoutId = window.setTimeout(tryScroll, 50)
        }
      }

      timeoutId = window.setTimeout(tryScroll, 0)

      return () => window.clearTimeout(timeoutId)
    }

    scrollToTop()

    const frameId = window.requestAnimationFrame(() => {
      scrollToTop()
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [pathname, hash, key])

  return null
}
