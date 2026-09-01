import { AUTH_CONFIG } from '@/auth/authConfig'
import { apiRequest, ApiError, getErrorMessage } from '@/auth/apiClient'
import {
  buildSession,
  clearStoredSession,
  getStoredSession,
  persistSession,
  setRememberMePreference,
} from '@/auth/authStorage'
import { authenticateDemoUser, getDashboardHome } from '@/auth/demoAuth'

const ROLE_LABELS = {
  user: 'Customer',
  tradesman: 'Tradesman',
  admin: 'Admin',
}

function normalizeRole(value = '') {
  const role = String(value).trim().toLowerCase()

  if (role === 'customer') return 'user'
  if (role === 'user' || role === 'tradesman' || role === 'admin') return role

  return null
}

function unwrapPayload(data) {
  if (!data || typeof data !== 'object') return data
  return data.data ?? data.result ?? data
}

export function mapApiResponseToSession(data, rememberMe) {
  const payload = unwrapPayload(data)
  const user = payload?.user ?? payload

  const role = normalizeRole(user?.role ?? user?.userType ?? user?.type)
  if (!role) {
    throw new ApiError('Login succeeded but the account role is missing or unsupported.')
  }

  const email = user?.email?.trim()
  if (!email) {
    throw new ApiError('Login succeeded but no email was returned for this account.')
  }

  const session = buildSession(
    {
      id: user?.id ?? user?._id ?? null,
      name: user?.name ?? user?.fullName ?? email.split('@')[0],
      role,
      roleLabel: user?.roleLabel ?? ROLE_LABELS[role] ?? role,
      email,
    },
    rememberMe,
    {
      accessToken:
        payload?.accessToken ??
        payload?.token ??
        payload?.access_token ??
        data?.accessToken ??
        data?.token ??
        null,
      refreshToken: payload?.refreshToken ?? payload?.refresh_token ?? null,
      expiresAt: payload?.expiresAt ?? payload?.expires_at ?? null,
    },
  )

  return session
}

async function loginWithApi(email, password, rememberMe) {
  const data = await apiRequest(AUTH_CONFIG.endpoints.login, {
    method: 'POST',
    body: {
      email: email.trim(),
      password,
    },
  })

  const session = mapApiResponseToSession(data, rememberMe)

  persistSession(session, rememberMe)
  setRememberMePreference(rememberMe)

  return session
}

function loginWithDemo(email, password, rememberMe) {
  const user = authenticateDemoUser(email, password)
  if (!user) {
    throw new ApiError('Invalid email or password.')
  }

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
      await apiRequest(AUTH_CONFIG.endpoints.logout, {
        method: 'POST',
        token: getAccessToken(),
      })
    } catch {
      // Always clear local session even if the API logout fails.
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

export { ApiError, getDashboardHome, getErrorMessage }
