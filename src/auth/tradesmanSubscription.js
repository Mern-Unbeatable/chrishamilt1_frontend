export const TRADESMAN_SUBSCRIPTION_STORAGE_KEY = 'tradetrust.tradesmanSubscriptions'

function readSubscriptions() {
  if (typeof window === 'undefined') return {}

  try {
    const stored = window.localStorage.getItem(TRADESMAN_SUBSCRIPTION_STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeSubscriptions(subscriptions) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(
    TRADESMAN_SUBSCRIPTION_STORAGE_KEY,
    JSON.stringify(subscriptions),
  )
}

export function hasTradesmanSubscription(email = '') {
  const key = email.trim().toLowerCase()
  if (!key) return false
  return Boolean(readSubscriptions()[key])
}

export function getTradesmanSubscription(email = '') {
  const key = email.trim().toLowerCase()
  if (!key) return null
  return readSubscriptions()[key] ?? null
}

export function activateTradesmanSubscription(email, planId) {
  const key = email.trim().toLowerCase()
  if (!key || !planId) return

  const subscriptions = readSubscriptions()
  subscriptions[key] = {
    planId,
    activatedAt: new Date().toISOString(),
  }
  writeSubscriptions(subscriptions)
}

export function clearTradesmanSubscription(email = '') {
  const key = email.trim().toLowerCase()
  if (!key) return

  const subscriptions = readSubscriptions()
  if (!(key in subscriptions)) return

  delete subscriptions[key]
  writeSubscriptions(subscriptions)
}

export function clearAllTradesmanSubscriptions() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TRADESMAN_SUBSCRIPTION_STORAGE_KEY)
}

export function getTradesmanHomePath(email = '') {
  return hasTradesmanSubscription(email)
    ? '/tradesman/dashboard'
    : '/tradesman/choose-plan'
}

/**
 * Sync local onboarding gate with live wallet/purchase state.
 * Returns true when the tradesman should access the dashboard.
 */
export async function syncTradesmanAccessFromWallet(email = '') {
  if (hasTradesmanSubscription(email)) return true

  const { AUTH_CONFIG } = await import('@/auth/authConfig')
  if (!AUTH_CONFIG.apiBaseUrl || AUTH_CONFIG.useDemoAuth) return false

  try {
    const { apiRequest } = await import('@/auth/apiClient')
    const { getAccessToken } = await import('@/auth/authService')

    const [walletPayload, purchasesPayload] = await Promise.all([
      apiRequest('/api/tradesman/wallet', { token: getAccessToken() }),
      apiRequest('/api/tradesman/purchases?page=1&limit=1', { token: getAccessToken() }),
    ])

    const wallet = walletPayload?.data ?? walletPayload ?? {}
    const purchases = purchasesPayload?.data ?? []
    const hasTokens =
      Number(wallet.availableTokens ?? 0) > 0 ||
      Number(wallet.tokensPurchased ?? 0) > 0 ||
      (Array.isArray(purchases) && purchases.length > 0)

    if (hasTokens) {
      activateTradesmanSubscription(email, 'wallet')
      return true
    }
  } catch {
    return false
  }

  return false
}
