import { getDashboardHome } from '@/auth/demoAuth'
import { getTradesmanHomePath } from '@/auth/tradesmanSubscription'

export function resolvePostAuthPath(user, from) {
  if (user.role === 'user') {
    return from || '/'
  }

  if (user.role === 'tradesman') {
    const fallback = getTradesmanHomePath()
    return from?.startsWith('/tradesman') ? from : fallback
  }

  const fallback = getDashboardHome(user.role)
  return from?.startsWith(`/${user.role}`) ? from : fallback
}

export function toApiRole(role = '') {
  const value = String(role).trim().toLowerCase()

  if (value === 'customer' || value === 'user') return 'USER'
  if (value === 'tradesman') return 'TRADESMAN'
  if (value === 'admin') return 'ADMIN'

  return String(role).trim().toUpperCase()
}
