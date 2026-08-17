import { AUTH_CONFIG } from '@/auth/authConfig'

const { storageKeys, rememberMeDays } = AUTH_CONFIG
const REMEMBER_MS = rememberMeDays * 24 * 60 * 60 * 1000

function readJson(storage, key) {
  try {
    const raw = storage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function isExpired(session) {
  return Boolean(session?.expiresAt && Date.now() > session.expiresAt)
}

function normalizeSession(session) {
  if (!session?.role) return null
  if (isExpired(session)) return null
  return session
}

export function getRememberMePreference() {
  try {
    return localStorage.getItem(storageKeys.rememberMe) !== '0'
  } catch {
    return true
  }
}

export function setRememberMePreference(rememberMe) {
  try {
    localStorage.setItem(storageKeys.rememberMe, rememberMe ? '1' : '0')
  } catch {
  }
}

export function getStoredSession() {
  const fromLocal = normalizeSession(readJson(localStorage, storageKeys.session))
  if (fromLocal) return fromLocal

  const fromSession = normalizeSession(readJson(sessionStorage, storageKeys.session))
  if (fromSession) return fromSession

  const legacy = normalizeSession(readJson(sessionStorage, storageKeys.legacySession))
  if (legacy) {
    persistSession(legacy, Boolean(legacy.expiresAt))
    sessionStorage.removeItem(storageKeys.legacySession)
    return legacy
  }

  return null
}

export function persistSession(session, rememberMe) {
  if (!session) return

  clearStoredSession()

  const payload = JSON.stringify(session)

  if (rememberMe) {
    localStorage.setItem(storageKeys.session, payload)
    return
  }

  sessionStorage.setItem(storageKeys.session, payload)
}

export function clearStoredSession() {
  localStorage.removeItem(storageKeys.session)
  sessionStorage.removeItem(storageKeys.session)
  sessionStorage.removeItem(storageKeys.legacySession)
}

export function buildSession(user, rememberMe) {
  return {
    ...user,
    accessToken: `demo-${user.role}-token`,
    refreshToken: null,
    expiresAt: rememberMe ? Date.now() + REMEMBER_MS : null,
  }
}
