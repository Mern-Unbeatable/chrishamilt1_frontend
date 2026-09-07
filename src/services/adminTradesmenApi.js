import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'

import { toDisplayUserStatus } from '@/services/adminUsersApi'

export const ADMIN_TRADESMEN_PAGE_SIZE = 10

export function isAdminTradesmenApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

function formatLocation(user) {
  const profileLocation = user.tradesmanProfile?.location?.trim()
  if (profileLocation) return profileLocation

  const parts = [user.address, user.city, user.region, user.zipCode].filter(Boolean)
  return parts.length ? parts.join('\n') : '—'
}

function mapStatus(status) {
  return toDisplayUserStatus(status)
}

export function mapApiTradesmanToRow(user) {
  const fullName =
    user.fullName?.trim() ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    '—'

  return {
    id: user.id,
    tradesmanName: user.tradesmanProfile?.businessName?.trim() || fullName,
    email: user.email ?? '—',
    phoneNumber: user.phoneNumber ?? '—',
    location: formatLocation(user),
    status: mapStatus(user.status),
    tokenBalance: user.tokenBalance ?? 0,
  }
}

function buildInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function mapApiTradesmanDetail(user = {}) {
  const profile = user.tradesmanProfile ?? {}
  const stats = user.stats ?? {}

  const fullName =
    user.fullName?.trim() ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    profile.businessName?.trim() ||
    '—'

  const tradesmanName = profile.businessName?.trim() || fullName
  const initials = buildInitials(tradesmanName || fullName) || 'T'

  const rawCreatedAt = user.createdAt || profile.createdAt
  const memberSince = rawCreatedAt ? String(rawCreatedAt).slice(0, 10) : '—'

  const pendingQuotes = Number(stats.pendingQuotes ?? 0)
  const acceptedQuotes = Number(stats.acceptedQuotes ?? 0)
  const completedJobsCount = Number(stats.completedJobs ?? profile.jobsCompleted ?? 0)
  const totalEarningsNum = Number(stats.totalEarnings ?? 0)

  const totalQuotesSent = pendingQuotes + acceptedQuotes + (stats.totalQuotesSent ?? 0)
  const jobsWonCount = acceptedQuotes + completedJobsCount
  const winRatePercent =
    totalQuotesSent > 0 ? Math.round((jobsWonCount / totalQuotesSent) * 100) : 0

  const avgJobValNum =
    completedJobsCount > 0 ? Math.round(totalEarningsNum / completedJobsCount) : 0

  const tokensPurchased = Number(stats.tokensPurchased ?? 0)
  const tokensRemaining = Number(stats.tokenBalance ?? user.tokenBalance ?? 0)
  const tokensUsed = Number(stats.tokensUsed ?? 0)
  const amountSpentNum = Number(stats.amountSpent ?? 0)

  const totalEarnedStr = `£${totalEarningsNum.toLocaleString('en-GB')}`
  const avgJobValueStr = `£${avgJobValNum.toLocaleString('en-GB')}`
  const totalSpentStr = `£${amountSpentNum.toLocaleString('en-GB')}`
  const jobsWonStr = `${jobsWonCount} of ${totalQuotesSent}`

  // Parse review distribution if provided, otherwise default 5..1 zeros
  const distribution = user.reviews?.distribution ?? [
    { stars: '5', count: Number(user.reviews?.distributionCount?.[5] ?? 0) },
    { stars: '4', count: Number(user.reviews?.distributionCount?.[4] ?? 0) },
    { stars: '3', count: Number(user.reviews?.distributionCount?.[3] ?? 0) },
    { stars: '2', count: Number(user.reviews?.distributionCount?.[2] ?? 0) },
    { stars: '1', count: Number(user.reviews?.distributionCount?.[1] ?? 0) },
  ]

  const reviewItems = (user.reviews?.items || user.reviews || []).map?.((rev, index) => ({
    id: rev.id || String(index + 1),
    name: rev.name || rev.authorName || rev.clientName || 'Client',
    initials: buildInitials(rev.name || rev.authorName || rev.clientName || 'Client'),
    rating: Number(rev.rating ?? 5),
    date: rev.date ? String(rev.date).slice(0, 10) : '—',
    text: rev.text || rev.comment || rev.content || '',
  })) || []

  const completedJobsList = (user.completedJobs || user.jobs || []).map?.((job, index) => ({
    id: job.id || String(index + 1),
    title: job.title || job.jobTitle || 'Completed Job',
    client: job.client || job.clientName || 'Client',
    date: job.date ? String(job.date).slice(0, 10) : '—',
    price: typeof job.price === 'number' ? `£${job.price.toLocaleString('en-GB')}` : job.price || '—',
    status: job.status || 'Completed',
  })) || []

  const tokenHistoryList = (user.tokens?.history || user.tokenHistory || []).map?.((hist, index) => ({
    id: hist.id || String(index + 1),
    name: hist.name || hist.packageName || 'Token Package',
    date: hist.date ? String(hist.date).slice(0, 10) : '—',
    price: typeof hist.price === 'number' ? `£${hist.price.toLocaleString('en-GB')}` : hist.price || '—',
    tokens: Number(hist.tokens ?? hist.quantity ?? 0),
  })) || []

  const averageRating = Number(stats.averageRating ?? profile.averageRating ?? 0)
  const totalReviews = Number(stats.totalReviews ?? profile.totalReviews ?? 0)

  return {
    id: user.id,
    fullName,
    tradesmanName,
    initials,
    email: user.email ?? '—',
    phoneNumber: user.phoneNumber ?? '—',
    location: formatLocation(user),
    status: mapStatus(user.status),
    memberSince,

    stats: {
      totalEarned: totalEarnedStr,
      jobsCompleted: completedJobsCount,
      quoteWinRate: `${winRatePercent}%`,
      avgJobValue: avgJobValueStr,
      totalQuotesSent,
      jobsWon: jobsWonStr,
      tokensPurchased,
      tokensRemaining,
    },

    tokens: {
      purchased: tokensPurchased,
      used: tokensUsed,
      remaining: tokensRemaining,
      totalSpent: totalSpentStr,
      history: tokenHistoryList,
    },

    completedJobs: {
      summary: {
        count: completedJobsCount,
        earned: totalEarnedStr,
      },
      footer: {
        quotesSent: totalQuotesSent,
        jobsWon: jobsWonStr,
        avgValue: avgJobValueStr,
      },
      jobs: completedJobsList,
    },

    reviews: {
      averageRating,
      totalReviews,
      distribution,
      items: reviewItems,
    },
  }
}

export async function fetchAdminTradesmen({
  page = 1,
  limit = ADMIN_TRADESMEN_PAGE_SIZE,
} = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))

  const payload = await apiRequest(`/api/admin/tradesmen?${params.toString()}`, {
    token: getAccessToken(),
  })

  const rows = payload?.data ?? []
  const pagination = payload?.pagination ?? {
    page,
    limit,
    total: rows.length,
    totalPages: Math.max(1, Math.ceil(rows.length / limit)),
  }

  return {
    tradesmen: rows.map(mapApiTradesmanToRow),
    pagination,
  }
}

export async function fetchAdminTradesmanDetail(tradesmanId) {
  if (!tradesmanId) {
    throw new Error('Tradesman ID is required.')
  }

  const payload = await apiRequest(`/api/admin/tradesmen/${encodeURIComponent(tradesmanId)}`, {
    token: getAccessToken(),
  })

  const user = payload?.data ?? payload
  return mapApiTradesmanDetail(user)
}

