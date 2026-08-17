import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { scrollToHash } from '@/helpers/scrollToHash'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return undefined
    }

    let attempts = 0
    let timeoutId

    const tryScroll = () => {
      if (scrollToHash(hash)) return

      attempts += 1
      if (attempts < 12) {
        timeoutId = window.setTimeout(tryScroll, 50)
      }
    }

    timeoutId = window.setTimeout(tryScroll, 0)

    return () => window.clearTimeout(timeoutId)
  }, [pathname, hash])

  return null
}
