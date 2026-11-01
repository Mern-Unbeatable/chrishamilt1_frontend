import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { DEMO_ADMINS } from '@/data/demoData'

const LOCAL_STORAGE_KEY = 'tradetrust_admin_users'

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
