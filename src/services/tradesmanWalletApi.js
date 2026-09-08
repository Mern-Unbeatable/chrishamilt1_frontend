import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'
import { DEMO_TOKEN_PRICING, DEMO_WALLET_STATS } from '@/data/demoData'
import { mapApiPackageToCard } from '@/services/adminPackagesApi'

export function isTradesmanWalletApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

export function mapApiWalletToStats(wallet = {}) {
  const quotesRemaining = wallet.quotesRemaining ?? null
  const quoteSubtext =
    quotesRemaining != null
      ? `≈ ${quotesRemaining} quote${quotesRemaining === 1 ? '' : 's'}`
      : ''

  return [
    {
      id: 'available',
      label: 'Available tokens',
      value: String(wallet.availableTokens ?? 0),
      subtext: quoteSubtext,
      icon: 'tokens',
      iconTone: 'teal',
    },
    {
      id: 'used',
      label: 'Tokens used',
      value: String(wallet.tokensUsed ?? 0),
      subtext: '',
      icon: 'used',
      iconTone: 'orange',
    },
    {
      id: 'purchased',
      label: 'Tokens purchased',
      value: String(wallet.tokensPurchased ?? 0),
      subtext: '',
      icon: 'purchased',
      iconTone: 'green',
    },
  ]
}

export async function fetchTradesmanWallet() {
  const payload = await apiRequest('/api/tradesman/wallet', {
    token: getAccessToken(),
  })

  const wallet = payload?.data ?? payload
  if (!wallet || typeof wallet !== 'object') {
    throw new Error('Unable to load wallet.')
  }

  return mapApiWalletToStats(wallet)
}

export async function fetchTokenPackages() {
  const payload = await apiRequest('/api/packages', {
    token: getAccessToken(),
  })

  const rows = (payload?.data ?? []).filter((pkg) => pkg.isActive !== false)

  return rows.map(mapApiPackageToCard)
}

export function getDemoWalletStats() {
  return DEMO_WALLET_STATS
}

export function getDemoTokenPackages() {
  return DEMO_TOKEN_PRICING
}

function formatPurchaseDate(value) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatPurchaseAmount(value) {
  const amount = Number(value ?? 0)
  return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function mapApiPurchaseToRow(purchase = {}) {
  return {
    id: purchase.id,
    packageName: purchase.packageName ?? purchase.package?.name ?? 'Token package',
    tokens: purchase.tokens ?? 0,
    amount: formatPurchaseAmount(purchase.amount),
    status: purchase.statusLabel ?? purchase.status ?? 'Pending',
    date: formatPurchaseDate(purchase.createdAt ?? purchase.date),
  }
}

export async function startTokenPackageCheckout(packageId) {
  const payload = await apiRequest(`/api/packages/${encodeURIComponent(packageId)}/checkout`, {
    method: 'POST',
    token: getAccessToken(),
  })

  const checkout = payload?.data ?? payload
  if (!checkout?.checkoutUrl) {
    throw new Error('Unable to start checkout.')
  }

  return checkout
}

export async function confirmTokenPackageCheckout(sessionId) {
  if (!sessionId) return null

  const payload = await apiRequest('/api/packages/confirm', {
    method: 'POST',
    token: getAccessToken(),
    body: { sessionId },
  })

  return payload?.data ?? payload
}

export async function fetchTradesmanPurchases({ page = 1, limit = 5 } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))

  const payload = await apiRequest(`/api/tradesman/purchases?${params.toString()}`, {
    token: getAccessToken(),
  })

  const rows = payload?.data ?? []
  return rows.map(mapApiPurchaseToRow)
}
