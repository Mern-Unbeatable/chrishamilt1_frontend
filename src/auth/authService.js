import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  buildSession,
  clearStoredSession,
  getStoredSession,
  persistSession,
  setRememberMePreference,
} from '@/auth/authStorage'
import { authenticateDemoUser, getDashboardHome } from '@/auth/demoAuth'

export function mapApiResponseToSession(data) {
  const user = data.user ?? data

  const session = buildSession(
    {
      name: user.name,
      role: user.role,
      roleLabel: user.roleLabel ?? user.role,
      email: user.email,
    },
    Boolean(data.rememberMe),
  )

  return {
    ...session,
    accessToken: data.accessToken ?? data.token ?? session.accessToken,
    refreshToken: data.refreshToken ?? null,
    expiresAt: data.expiresAt ?? session.expiresAt,
  }
}

async function loginWithApi(email, password, rememberMe) {
  const response = await fetch(`${AUTH_CONFIG.apiBaseUrl}${AUTH_CONFIG.endpoints.login}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, rememberMe }),
  })

  if (!response.ok) return null

  const data = await response.json()
  const session = mapApiResponseToSession({ ...data, rememberMe })

  persistSession(session, rememberMe)
  setRememberMePreference(rememberMe)

  return session
}

function loginWithDemo(email, password, rememberMe) {
  const user = authenticateDemoUser(email, password)
  if (!user) return null

  const session = buildSession(user, rememberMe)
  persistSession(session, rememberMe)
  setRememberMePreference(rememberMe)

  return session
}

export async function login({ email, password, rememberMe = false }) {
  if (AUTH_CONFIG.useDemoAuth) {
    return loginWithDemo(email, password, rememberMe)
  }

  return loginWithApi(email, password, rememberMe)
}

export async function logout() {
  if (!AUTH_CONFIG.useDemoAuth) {
    try {
      await fetch(`${AUTH_CONFIG.apiBaseUrl}${AUTH_CONFIG.endpoints.logout}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${getAccessToken() ?? ''}`,
        },
      })
    } catch {
    }
  }

  clearStoredSession()
}

export function getSession() {
  return getStoredSession()
}

export function getAccessToken() {
  return getStoredSession()?.accessToken ?? null
}

export { getDashboardHome }
