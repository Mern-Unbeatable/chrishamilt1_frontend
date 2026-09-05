import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'

import { toDisplayUserStatus } from '@/services/adminUsersApi'

export const ADMIN_CUSTOMERS_PAGE_SIZE = 10

export function isAdminCustomersApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

function formatJoinedDate(value) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatLocation(user) {
  const parts = [user.address, user.city, user.region, user.zipCode].filter(Boolean)
  return parts.length ? parts.join('\n') : '—'
}

function mapStatus(status) {
  return toDisplayUserStatus(status)
}

export function mapApiCustomerToRow(user) {
  const fullName =
    user.fullName?.trim() ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    '—'

  return {
    id: user.id,
    userName: fullName,
    email: user.email ?? '—',
    phoneNumber: user.phoneNumber ?? '—',
    location: formatLocation(user),
    jobsPosted: user._count?.postedJobs ?? 0,
    status: mapStatus(user.status),
    joinedDate: formatJoinedDate(user.createdAt),
  }
}

export async function fetchAdminCustomers({
  page = 1,
  limit = ADMIN_CUSTOMERS_PAGE_SIZE,
} = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))

  const payload = await apiRequest(`/api/admin/customers?${params.toString()}`, {
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
    customers: rows.map(mapApiCustomerToRow),
    pagination,
  }
}
