import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  DEMO_TRADESMAN_RATING_DISTRIBUTION,
  DEMO_TRADESMAN_REVIEWS,
  DEMO_TRADESMAN_REVIEWS_SUMMARY,
} from '@/data/tradesmanReviewsData'

export const TRADESMAN_REVIEWS_PAGE_SIZE = 10

function formatReviewDate(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function normalizePagination(payload, { page, limit, rowsLength }) {
  const raw = payload?.pagination ?? payload?.meta ?? {}
  const total = payload?.total ?? raw.total ?? raw.totalCount ?? rowsLength
  const pageLimit = raw.limit ?? raw.pageSize ?? limit
  const currentPage = raw.page ?? raw.currentPage ?? page
  const totalPages =
    raw.totalPages ??
    raw.pageCount ??
    Math.max(1, Math.ceil(Number(total) / Number(pageLimit)))

  return {
    page: Number(currentPage),
    limit: Number(pageLimit),
    total: Number(total),
    totalPages: Number(totalPages),
  }
}

export function isTradesmanReviewsApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

export function mapApiReviewToCard(review = {}) {
  const reviewer = review.reviewer ?? {}
  const name = reviewer.fullName || reviewer.firstName || 'Customer'

  return {
    id: review.id,
    name,
    initials: getInitials(name),
    rating: Number(review.rating ?? 0),
    jobTitle: review.job?.title ?? 'Job review',
    date: formatReviewDate(review.createdAt),
    text: review.comment ?? '',
  }
}

export function mapApiReviewsSummary(summary = {}) {
  const distribution = summary.distribution ?? {}
  const distributionRows = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: Number(distribution[stars] ?? 0),
  }))

  return {
    averageRating: Number(summary.averageRating ?? 0),
    totalReviews: Number(summary.totalReviews ?? 0),
    distribution: distributionRows,
  }
}

export async function fetchTradesmanReviews({ page = 1, limit = TRADESMAN_REVIEWS_PAGE_SIZE } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))

  const payload = await apiRequest(`/api/reviews/mine?${params.toString()}`, {
    token: getAccessToken(),
  })

  const data = payload?.data ?? {}
  const rows = data.reviews ?? []
  const pagination = normalizePagination(payload, { page, limit, rowsLength: rows.length })

  return {
    summary: mapApiReviewsSummary(data.summary ?? {}),
    reviews: rows.map(mapApiReviewToCard),
    pagination,
  }
}

export function getDemoTradesmanReviewsPage() {
  return {
    summary: {
      averageRating: DEMO_TRADESMAN_REVIEWS_SUMMARY.averageRating,
      totalReviews: DEMO_TRADESMAN_REVIEWS_SUMMARY.totalReviews,
      distribution: DEMO_TRADESMAN_RATING_DISTRIBUTION,
    },
    reviews: DEMO_TRADESMAN_REVIEWS,
    pagination: {
      page: 1,
      limit: TRADESMAN_REVIEWS_PAGE_SIZE,
      total: DEMO_TRADESMAN_REVIEWS.length,
      totalPages: 1,
    },
  }
}
