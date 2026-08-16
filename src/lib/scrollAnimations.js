import { gsap } from '@/lib/gsap'

const DEFAULT_TRIGGER = {
  start: 'top 86%',
  toggleActions: 'play none none reverse',
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function initScrollAnimations(root) {
  if (!root || prefersReducedMotion()) return undefined

  gsap.utils.toArray('[data-scroll-hero]', root).forEach((hero) => {
    const items = gsap.utils.toArray('[data-scroll-hero-item]', hero)
    const targets = items.length ? items : [hero]

    gsap.from(targets, {
      y: 22,
      opacity: 0,
      duration: 0.85,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.08,
      clearProps: 'transform',
    })
  })

  gsap.utils.toArray('[data-scroll-section]', root).forEach((section) => {
    const items = gsap.utils.toArray('[data-scroll-item]', section)
    const header = section.querySelector('[data-scroll-header]')
    const trigger = { ...DEFAULT_TRIGGER, trigger: section }

    if (header) {
      gsap.from(header, {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: trigger,
        clearProps: 'transform',
      })
    }

    if (items.length) {
      gsap.from(items, {
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { ...trigger, start: 'top 84%' },
        clearProps: 'transform',
      })
    } else if (!header) {
      gsap.from(section, {
        y: 36,
        opacity: 0,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: trigger,
        clearProps: 'transform',
      })
    }
  })
}
