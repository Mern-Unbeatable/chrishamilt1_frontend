import { AUTH_CONFIG } from '@/auth/authConfig'
import { apiRequest, ApiError, getErrorMessage } from '@/auth/apiClient'
import {
  buildSession,
  clearStoredSession,
  getRememberMePreference,
  getStoredSession,
  persistSession,
  setRememberMePreference,
} from '@/auth/authStorage'
import { authenticateDemoUser, getDashboardHome } from '@/auth/demoAuth'
import { toApiRole } from '@/auth/postAuthRedirect'

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

async function registerWithApi({
  fullName,
  email,
  phoneNumber,
  address,
  password,
  role,
}) {
  const data = await apiRequest(AUTH_CONFIG.endpoints.register, {
    method: 'POST',
    body: {
      fullName: fullName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
      password,
      role: toApiRole(role),
    },
  })

  const payload = unwrapPayload(data)
  const hasAuth =
    payload?.accessToken ||
    payload?.token ||
    payload?.access_token ||
    payload?.user

  if (!hasAuth) {
    return { session: null, autoLogin: false }
  }

  const session = mapApiResponseToSession(data, true)
  persistSession(session, true)
  setRememberMePreference(true)

  return { session, autoLogin: true }
}

export async function register(payload) {
  if (AUTH_CONFIG.useDemoAuth) {
    throw new ApiError(
      'Registration is disabled in demo mode. Use an existing demo account to sign in.',
    )
  }

  return registerWithApi(payload)
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

export async function fetchCurrentUser() {
  const data = await apiRequest(AUTH_CONFIG.endpoints.me, {
    token: getAccessToken(),
  })

  const user = unwrapPayload(data)
  if (!user) {
    throw new ApiError('Unable to load your profile right now.')
  }

  return user
}

export function validateProfileUpdate({ fullName, email }) {
  if (!fullName?.trim()) {
    return 'Name is required.'
  }

  if (!email?.trim()) {
    return 'Email is required.'
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email.trim())) {
    return 'Enter a valid email address.'
  }

  return null
}

export async function updateUserProfile({ fullName, email }) {
  const data = await apiRequest(AUTH_CONFIG.endpoints.profile, {
    method: 'PUT',
    body: {
      fullName: fullName.trim(),
      email: email.trim(),
    },
    token: getAccessToken(),
  })

  const payload = unwrapPayload(data)
  return payload?.user ?? payload
}

export function patchSessionUser(updates = {}) {
  const session = getSession()
  if (!session) return null

  const next = { ...session, ...updates }
  persistSession(next, getRememberMePreference())
  return next
}

export function mapApiUserToAdminProfile(user) {
  const fullName =
    user.fullName?.trim() ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim()

  return {
    displayName: fullName,
    displayEmail: user.email ?? '',
    name: fullName,
    email: user.email ?? '',
    phone: user.phoneNumber ?? '',
    avatarUrl: user.profileImage ?? null,
    warehouses: user.warehouses ?? [],
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}

export function validatePasswordChange({
  currentPassword,
  newPassword,
  confirmPassword,
  requireCurrent = true,
}) {
  if (requireCurrent && !currentPassword?.trim()) {
    return 'Current password is required.'
  }

  if (!newPassword?.trim()) {
    return 'New password is required.'
  }

  if (!confirmPassword?.trim()) {
    return 'Please confirm your new password.'
  }

  if (newPassword.length < 8) {
    return 'New password must be at least 8 characters.'
  }

  if (newPassword !== confirmPassword) {
    return 'New password and confirmation do not match.'
  }

  if (requireCurrent && newPassword === currentPassword) {
    return 'New password must be different from your current password.'
  }

  return null
}

export async function changeUserPassword({
  currentPassword,
  newPassword,
  confirmPassword,
}) {
  return apiRequest(AUTH_CONFIG.endpoints.changePassword, {
    method: 'PUT',
    body: {
      currentPassword,
      newPassword,
      confirmPassword,
    },
    token: getAccessToken(),
  })
}

export { ApiError, getDashboardHome, getErrorMessage }
