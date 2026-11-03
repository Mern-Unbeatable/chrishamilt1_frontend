import { AUTH_CONFIG } from '@/auth/authConfig'
import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { DEMO_ADMINS } from '@/data/demoData'
import { toDisplayUserStatus, deleteAdminUser } from '@/services/adminUsersApi'

export { deleteAdminUser }

export const ADMIN_ADMINS_PAGE_SIZE = 10

const LOCAL_STORAGE_KEY = 'tradetrust_admin_users'

export function isAdminUsersApiEnabled() {
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

export function mapApiAdminToRow(admin = {}) {
  const fullName =
    admin.fullName?.trim() ||
    [admin.firstName, admin.lastName].filter(Boolean).join(' ').trim() ||
    admin.email?.split('@')[0] ||
    'Admin'

  const isPrimary =
    Boolean(admin.isPrimaryAdmin) ||
    admin.email?.toLowerCase() === 'admin@tradersinloop.co.uk'

  return {
    id: admin.id,
    fullName,
    email: admin.email ?? '—',
    phoneNumber: admin.phoneNumber ?? '—',
    address: admin.address ?? '—',
    role: admin.role || 'ADMIN',
    status: toDisplayUserStatus(admin.status) || 'Active',
    joinedDate: formatJoinedDate(admin.createdAt),
    isPrimaryAdmin: isPrimary,
    raw: admin,
  }
}

export async function fetchAdminUsers({ page = 1, limit = 7 } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))

  const payload = await apiRequest(`/api/admin/admins?${params.toString()}`, {
    token: getAccessToken(),
  })

  const rows = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.data?.admins)
      ? payload.data.admins
      : []

  const pagination = payload?.pagination ?? {
    page,
    limit,
    total: rows.length,
    totalPages: Math.max(1, Math.ceil(rows.length / limit)),
  }

  return {
    admins: rows.map(mapApiAdminToRow),
    pagination,
  }
}

export function getStoredAdminUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return DEMO_ADMINS
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : DEMO_ADMINS
  } catch {
    return DEMO_ADMINS
  }
}

export function saveStoredAdminUsers(admins) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(admins))
  } catch {
    // ignore
  }
}

export function deleteStoredAdminUser(adminId) {
  try {
    const current = getStoredAdminUsers()
    const updated = current.filter((admin) => String(admin.id) !== String(adminId))
    saveStoredAdminUsers(updated)
    return updated
  } catch {
    return []
  }
}

function formatCurrentDate() {
  return new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Creates an admin user via real POST /api/auth/register endpoint.
 * Backend receives:
 * {
 *   "fullName": "...",
 *   "email": "...",
 *   "phoneNumber": "...",
 *   "address": "...",
 *   "password": "...",
 *   "role": "ADMIN"
 * }
 */
export async function createAdminUser({
  fullName,
  email,
  phoneNumber,
  address,
  password,
  role = 'ADMIN',
}) {
  const body = {
    fullName: String(fullName ?? '').trim(),
    email: String(email ?? '').trim(),
    phoneNumber: String(phoneNumber ?? '').trim(),
    address: String(address ?? '').trim(),
    password: String(password ?? ''),
    role: role || 'ADMIN',
  }

  const payload = await apiRequest('/api/auth/register', {
    method: 'POST',
    body,
    token: getAccessToken(),
  })

  const responseData = payload?.data ?? payload?.user ?? payload ?? {}

  const newAdminRow = {
    id: responseData.id || `admin-${Date.now()}`,
    fullName: responseData.fullName || responseData.name || body.fullName,
    email: responseData.email || body.email,
    phoneNumber: responseData.phoneNumber || body.phoneNumber,
    address: responseData.address || body.address,
    role: responseData.role || 'ADMIN',
    status: 'Active',
    joinedDate: formatCurrentDate(),
  }

  const current = getStoredAdminUsers()
  const updated = [newAdminRow, ...current]
  saveStoredAdminUsers(updated)

  return {
    raw: responseData,
    admin: newAdminRow,
  }
}
