export const DEMO_CREDENTIALS = {
  user: { email: 'user@tradetrust.uk', password: 'demo123' },
  tradesman: { email: 'tradesman@tradetrust.uk', password: 'demo123' },
  admin: { email: 'admin@tradetrust.uk', password: 'demo123' },
}

export const DEMO_USERS = {
  user: {
    name: 'Sarah Nichols',
    role: 'user',
    roleLabel: 'Customer',
    email: DEMO_CREDENTIALS.user.email,
  },
  tradesman: {
    name: 'Atik Adnan',
    role: 'tradesman',
    roleLabel: 'Tradesman',
    email: DEMO_CREDENTIALS.tradesman.email,
  },
  admin: {
    name: 'Atik Adnan',
    role: 'admin',
    roleLabel: 'Admin',
    email: DEMO_CREDENTIALS.admin.email,
  },
}

export function resolveDemoRole(email = '') {
  const value = email.trim().toLowerCase()

  if (value === DEMO_CREDENTIALS.user.email) return 'user'
  if (value === DEMO_CREDENTIALS.tradesman.email) return 'tradesman'
  if (value === DEMO_CREDENTIALS.admin.email) return 'admin'
  if (value.includes('admin')) return 'admin'
  if (value.includes('tradesman')) return 'tradesman'
  if (value.includes('user') || value.includes('customer')) return 'user'

  return null
}

export function authenticateDemoUser(email, password) {
  const role = resolveDemoRole(email)
  if (!role) return null

  const credentials = DEMO_CREDENTIALS[role]
  if (password !== credentials.password) return null

  return DEMO_USERS[role]
}

export function getDashboardHome(role) {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'tradesman') return '/tradesman/dashboard'
  return '/'
}
