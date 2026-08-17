import { useEffect, useState } from 'react'

/**
 * Tracks whether a page section is meaningfully in the viewport.
 * Used for nav highlights on hash/section links (not full routes).
 */
export function useSectionInView(sectionId, enabled = true) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!enabled || !sectionId) {
      setInView(false)
      return undefined
    }

    let observer
    let timeoutId
    let attempts = 0

    const observe = () => {
      const element = document.getElementById(sectionId)
      if (!element) {
        attempts += 1
        if (attempts < 20) {
          timeoutId = window.setTimeout(observe, 50)
        }
        return
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          setInView(entry.isIntersecting)
        },
        {
          root: null,
          // Navbar offset + require section to sit in the upper half of the screen
          rootMargin: '-80px 0px -50% 0px',
          threshold: 0.15,
        },
      )

      observer.observe(element)
    }

    observe()

    return () => {
      window.clearTimeout(timeoutId)
      observer?.disconnect()
      setInView(false)
    }
  }, [sectionId, enabled])

  return inView
}
