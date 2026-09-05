import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'

import { toDisplayUserStatus } from '@/services/adminUsersApi'

export const ADMIN_TRADESMEN_PAGE_SIZE = 10

export function isAdminTradesmenApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

function formatLocation(user) {
  const profileLocation = user.tradesmanProfile?.location?.trim()
  if (profileLocation) return profileLocation

  const parts = [user.address, user.city, user.region, user.zipCode].filter(Boolean)
  return parts.length ? parts.join('\n') : '—'
}

function mapStatus(status) {
  return toDisplayUserStatus(status)
}

export function mapApiTradesmanToRow(user) {
  const fullName =
    user.fullName?.trim() ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    '—'

  return {
    id: user.id,
    tradesmanName: user.tradesmanProfile?.businessName?.trim() || fullName,
    email: user.email ?? '—',
    phoneNumber: user.phoneNumber ?? '—',
    location: formatLocation(user),
    status: mapStatus(user.status),
    tokenBalance: user.tokenBalance ?? 0,
  }
}

export async function fetchAdminTradesmen({
  page = 1,
  limit = ADMIN_TRADESMEN_PAGE_SIZE,
} = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))

  const payload = await apiRequest(`/api/admin/tradesmen?${params.toString()}`, {
    token: getAccessToken(),
  })

  const rows = payload?.data ?? []
  const pagination = payload?.pagination ?? {
    page,
    limit,
    total: rows.length,
    totalPages: Math.max(1, Math.ceil(rows.length / limit)),
  }

  return {
    tradesmen: rows.map(mapApiTradesmanToRow),
    pagination,
  }
}
