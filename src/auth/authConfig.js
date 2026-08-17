
export const AUTH_CONFIG = {
  useDemoAuth: true,

  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',

  endpoints: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },

  storageKeys: {
    session: 'tradetrust_auth_session',
    legacySession: 'tradetrust_demo_session',
    rememberMe: 'tradetrust_remember_me',
  },

  rememberMeDays: 30,
}
