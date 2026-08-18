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

export function getTradesmanHomePath(email = '') {
  return hasTradesmanSubscription(email)
    ? '/tradesman/dashboard'
    : '/tradesman/choose-plan'
}
