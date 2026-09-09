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
    jobsPosted: user._count?.postedJobs ?? user.stats?.jobsPosted ?? 0,
    status: mapStatus(user.status),
    joinedDate: formatJoinedDate(user.createdAt),
  }
}

export function mapApiCustomerDetail(user = {}) {
  const row = mapApiCustomerToRow(user)
  const stats = user.stats ?? {}
  const jobs = Array.isArray(user.postedJobs)
    ? user.postedJobs
    : Array.isArray(user.jobs)
      ? user.jobs
      : []

  return {
    ...row,
    avatar: user.profileImage ?? null,
    address: user.address ?? '',
    city: user.city ?? '',
    region: user.region ?? '',
    zipCode: user.zipCode ?? '',
    bookingsCount: Number(stats.bookings ?? user._count?.customerBookings ?? 0),
    completedJobs: Number(stats.completedJobs ?? 0),
    cancelledJobs: Number(stats.cancelledJobs ?? 0),
    recentJobs: jobs.slice(0, 8).map((job, index) => ({
      id: job.id || String(index + 1),
      title: job.title || 'Job',
      status: job.status || '—',
      location: job.location || job.city || '—',
      createdAt: formatJoinedDate(job.createdAt),
    })),
  }
}

export async function fetchAdminCustomer(customerId) {
  if (!customerId) {
    throw new Error('Customer not found.')
  }

  const payload = await apiRequest(`/api/admin/customers/${encodeURIComponent(customerId)}`, {
    token: getAccessToken(),
  })

  const user = payload?.data ?? payload
  if (!user?.id) {
    throw new Error('Customer not found.')
  }

  return mapApiCustomerDetail(user)
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
