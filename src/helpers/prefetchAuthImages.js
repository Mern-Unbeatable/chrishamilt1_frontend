import { AUTH_IMAGE_SOURCES } from '@/assets/authImages'

const loadedSources = new Set()
const preloadedLinks = new Set()

function preloadImage(src, { highPriority = false } = {}) {
  if (!src || typeof window === 'undefined' || loadedSources.has(src)) {
    return
  }

  loadedSources.add(src)

  if (highPriority && !preloadedLinks.has(src)) {
    preloadedLinks.add(src)

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.append(link)
  }

  const image = new Image()
  image.decoding = 'async'
  image.src = src
}

export function prefetchAuthImages({ highPriority = false } = {}) {
  AUTH_IMAGE_SOURCES.forEach((src) => preloadImage(src, { highPriority }))
}

/** Warm auth hero images after the landing page has painted. */
export function scheduleAuthImagePrefetch() {
  if (typeof window === 'undefined') return

  const run = () => prefetchAuthImages()

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(run, { timeout: 4000 })
    return
  }

  window.setTimeout(run, 2000)
}

/** Call on auth link hover/focus so images are ready before navigation. */
export function prefetchAuthImagesOnIntent() {
  prefetchAuthImages({ highPriority: true })
}
