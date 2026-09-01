function readBackendUrl() {
  const value = import.meta.env.VITE_BACKEND_URL?.trim()
  return value ? value.replace(/\/$/, '') : ''
}

const apiBaseUrl = readBackendUrl()
const forceDemoAuth = import.meta.env.VITE_USE_DEMO_AUTH === 'true'

export const AUTH_CONFIG = {
  apiBaseUrl,
  useDemoAuth: forceDemoAuth || !apiBaseUrl,

  endpoints: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    me: '/api/auth/me',
  },

  storageKeys: {
    session: 'tradetrust_auth_session',
    legacySession: 'tradetrust_demo_session',
    rememberMe: 'tradetrust_remember_me',
  },

  rememberMeDays: 30,
}
