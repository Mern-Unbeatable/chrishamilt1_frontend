export function scrollToHash(hash, behavior = 'smooth') {
  const id = hash.replace(/^#/, '')
  if (!id) return false

  const element = document.getElementById(id)
  if (!element) return false

  element.scrollIntoView({ behavior, block: 'start' })
  return true
}
