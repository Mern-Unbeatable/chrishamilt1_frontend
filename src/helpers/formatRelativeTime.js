const UNITS = [
  { limit: 60, divisor: 1, unit: 'minute' },
  { limit: 3600, divisor: 60, unit: 'hour' },
  { limit: 86400, divisor: 3600, unit: 'day' },
  { limit: 604800, divisor: 86400, unit: 'week' },
]

export function formatRelativeTime(value) {
  if (!value) return 'Recently posted'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently posted'

  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000))

  if (seconds < 60) return 'Just now'

  for (const { limit, divisor, unit } of UNITS) {
    if (seconds < limit) {
      const amount = Math.floor(seconds / divisor)
      return `${amount} ${unit}${amount === 1 ? '' : 's'} ago`
    }
  }

  const weeks = Math.floor(seconds / 604800)
  return `${weeks} week${weeks === 1 ? '' : 's'} ago`
}
