import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'

export const DEFAULT_CONTACT_SETTINGS = {
  address: '1 enterprise house, barkering, London IG11 0JZ, United Kingdom',
  phone: '07392255366',
  email: 'admin@tradersinloop.co.uk',
  updatedAt: null,
}

const STORAGE_KEY = 'tradetrust_site_contact_settings'

function getCachedContactSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONTACT_SETTINGS
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_CONTACT_SETTINGS,
      ...parsed,
    }
  } catch {
    return DEFAULT_CONTACT_SETTINGS
  }
}

function setCachedContactSettings(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage errors
  }
}

/**
 * Fetches contact settings from GET /api/settings/contact
 * Backend response format:
 * {
 *   "success": true,
 *   "message": "Contact settings fetched",
 *   "data": {
 *     "address": "...",
 *     "phone": "...",
 *     "email": "...",
 *     "updatedAt": "..."
 *   }
 * }
 */
export async function fetchContactSettings() {
  try {
    const payload = await apiRequest('/api/settings/contact')
    const data = payload?.data ?? payload

    if (data && typeof data === 'object') {
      const normalized = {
        address: data.address?.trim() || DEFAULT_CONTACT_SETTINGS.address,
        phone: data.phone?.trim() || DEFAULT_CONTACT_SETTINGS.phone,
        email: data.email?.trim() || DEFAULT_CONTACT_SETTINGS.email,
        updatedAt: data.updatedAt || null,
      }
      setCachedContactSettings(normalized)
      return normalized
    }
  } catch {
    // Return cached settings or default on error
  }

  return getCachedContactSettings()
}

/**
 * Updates contact settings via PUT /api/admin/settings/contact
 * Backend receives:
 * {
 *   "address": "...",
 *   "phone": "...",
 *   "email": "..."
 * }
 */
export async function updateContactSettings({ address, phone, email }) {
  const body = {
    address: String(address ?? '').trim(),
    phone: String(phone ?? '').trim(),
    email: String(email ?? '').trim(),
  }

  const payload = await apiRequest('/api/admin/settings/contact', {
    method: 'PUT',
    body,
    token: getAccessToken(),
  })

  const data = payload?.data ?? payload ?? {}
  const normalized = {
    address: data.address?.trim() || body.address,
    phone: data.phone?.trim() || body.phone,
    email: data.email?.trim() || body.email,
    updatedAt: data.updatedAt || new Date().toISOString(),
  }

  setCachedContactSettings(normalized)
  return normalized
}
