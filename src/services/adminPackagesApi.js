import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'
import { DEMO_ADMIN_TOKEN_PACKAGES } from '@/data/adminTokenData'

export function isAdminPackagesApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

function formatPackagePrice(price) {
  return `£${Number(price ?? 0).toLocaleString('en-GB')}`
}

function formatRateLabel(price, tokenQuantity) {
  if (!tokenQuantity) return ''

  const rate = Number(price) / tokenQuantity
  return `£${rate.toFixed(2)} per token`
}

function parseNumericPrice(price) {
  const value = Number(String(price ?? '').replace(/[^\d.]/g, ''))
  return Number.isFinite(value) ? value : 0
}

function unwrapPackage(data) {
  const payload = data?.data ?? data
  return payload?.package ?? payload
}

export function buildPackagePayload({
  planName,
  price,
  tokens,
  description,
  featured,
  stripePriceId,
}) {
  const body = {
    name: planName.trim(),
    price: parseNumericPrice(price),
    tokenQuantity: Number(tokens),
    description: description.trim(),
    isPopular: Boolean(featured),
  }

  const stripeId = stripePriceId?.trim()
  if (stripeId) {
    body.stripePriceId = stripeId
  }

  return body
}

export function mapApiPackageToCard(pkg) {
  return {
    id: pkg.id,
    planName: pkg.name ?? '',
    price: formatPackagePrice(pkg.price),
    tokens: pkg.tokenQuantity ?? 0,
    rateLabel: formatRateLabel(pkg.price, pkg.tokenQuantity),
    description: pkg.description ?? '',
    featured: Boolean(pkg.isPopular),
    badgeLabel: pkg.badge || 'Most popular',
    isActive: pkg.isActive ?? true,
    stripePriceId: pkg.stripePriceId ?? null,
    purchaseCount: pkg.purchaseCount ?? 0,
  }
}

export function getDemoAdminPackages() {
  return DEMO_ADMIN_TOKEN_PACKAGES.map((plan) => ({ ...plan }))
}

export async function fetchAdminPackages() {
  const payload = await apiRequest('/api/admin/packages', {
    token: getAccessToken(),
  })

  const rows = payload?.data ?? []

  return {
    packages: rows.map(mapApiPackageToCard),
    total: payload?.total ?? rows.length,
  }
}

export async function createAdminPackage(body) {
  const payload = await apiRequest('/api/admin/packages', {
    method: 'POST',
    body,
    token: getAccessToken(),
  })

  return mapApiPackageToCard(unwrapPackage(payload))
}

export async function updateAdminPackage(packageId, body) {
  if (!packageId) {
    throw new Error('Package not found.')
  }

  const payload = await apiRequest(`/api/admin/packages/${encodeURIComponent(packageId)}`, {
    method: 'PUT',
    body,
    token: getAccessToken(),
  })

  return mapApiPackageToCard(unwrapPackage(payload))
}

export async function deleteAdminPackage(packageId) {
  if (!packageId) {
    throw new Error('Package not found.')
  }

  await apiRequest(`/api/admin/packages/${encodeURIComponent(packageId)}`, {
    method: 'DELETE',
    token: getAccessToken(),
  })
}

export function mapApiPurchaseToRow(purchase = {}) {
  const tradesman = purchase.tradesman ?? {}
  const pkg = purchase.package ?? {}

  const rawDate = purchase.date || purchase.createdAt
  const dateStr = rawDate ? String(rawDate).slice(0, 10) : '—'

  const amountNum = Number(purchase.amount ?? pkg.price ?? 0)
  const formattedAmount = `£${amountNum.toLocaleString('en-GB')}`

  const tradesmanName =
    tradesman.fullName ||
    purchase.tradesmanName?.replace(/\s*\(.*?\)\s*$/, '') ||
    'Tradesman'

  const company =
    tradesman.businessName ||
    purchase.company ||
    tradesman.email ||
    ''

  const statusLabel =
    purchase.statusLabel ||
    (purchase.status === 'COMPLETED' ? 'Paid' : purchase.status || 'Paid')

  return {
    id: purchase.id,
    tradesmanName,
    company,
    packageName: purchase.packageName || pkg.name || '—',
    tokens: Number(purchase.tokens ?? pkg.tokenQuantity ?? 0),
    amount: formattedAmount,
    status: statusLabel,
    date: dateStr,
    raw: purchase,
  }
}

export async function fetchAdminPurchases({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))

  const payload = await apiRequest(`/api/admin/purchases?${params.toString()}`, {
    token: getAccessToken(),
  })

  const rows = payload?.data ?? []
  const total = Number(payload?.total ?? payload?.pagination?.total ?? rows.length)
  const totalPages = Number(
    payload?.pagination?.totalPages ?? Math.max(1, Math.ceil(total / limit)),
  )

  return {
    purchases: rows.map(mapApiPurchaseToRow),
    total,
    totalPages,
    page: Number(payload?.pagination?.page ?? page),
    limit: Number(payload?.pagination?.limit ?? limit),
  }
}

