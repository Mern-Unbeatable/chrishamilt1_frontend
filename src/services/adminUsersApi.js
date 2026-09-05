import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'

export const ADMIN_USER_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
}

export function toDisplayUserStatus(status) {
  const normalized = String(status || '').trim().toUpperCase()

  if (normalized === ADMIN_USER_STATUS.ACTIVE) return 'Active'
  if (normalized === ADMIN_USER_STATUS.SUSPENDED || normalized === 'SUSPEND') return 'Suspend'

  return status || 'Unknown'
}

export function toApiUserStatus(status) {
  const normalized = String(status || '').trim().toUpperCase()

  if (normalized === 'ACTIVE') return ADMIN_USER_STATUS.ACTIVE
  if (normalized === 'SUSPEND' || normalized === 'SUSPENDED') {
    return ADMIN_USER_STATUS.SUSPENDED
  }

  return status
}

export async function updateAdminUserStatus(userId, status) {
  if (!userId) {
    throw new Error('User not found.')
  }

  await apiRequest(`/api/admin/users/${encodeURIComponent(userId)}/status`, {
    method: 'PATCH',
    body: {
      status: toApiUserStatus(status),
    },
    token: getAccessToken(),
  })

  return toDisplayUserStatus(status)
}
