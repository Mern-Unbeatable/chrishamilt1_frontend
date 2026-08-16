const SESSION_KEY = 'tradetrust_demo_session'

export const DEMO_USERS = {
  admin: {
    name: 'Atik Adnan',
    role: 'admin',
    roleLabel: 'Admin',
    email: 'admin@tradetrust.uk',
  },
  tradesman: {
    name: 'Atik Adnan',
    role: 'tradesman',
    roleLabel: 'Tradesman',
    email: 'tradesman@tradetrust.uk',
  },
}

export function resolveDemoRole(email = '') {
  const value = email.toLowerCase()

  if (value.includes('admin')) return 'admin'
  if (value.includes('tradesman')) return 'tradesman'
  return null
}

export function getDemoSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setDemoSession(role) {
  const user = DEMO_USERS[role]
  if (!user) return null
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export function clearDemoSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function getDashboardHome(role) {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'tradesman') return '/tradesman/dashboard'
  return '/'
}
