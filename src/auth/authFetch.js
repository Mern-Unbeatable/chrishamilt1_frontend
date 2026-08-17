
import { AUTH_CONFIG } from '@/auth/authConfig'
import { getAccessToken } from '@/auth/authService'

export async function authFetch(path, options = {}) {
  const headers = new Headers(options.headers)
  const token = getAccessToken()

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(`${AUTH_CONFIG.apiBaseUrl}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })
}
