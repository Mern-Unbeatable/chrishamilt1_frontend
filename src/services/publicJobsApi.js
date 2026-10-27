import { apiRequest } from '@/auth/apiClient'
import { AUTH_CONFIG } from '@/auth/authConfig'
import { DEFAULT_TRADE_CATEGORIES } from '@/data/categoriesData'
import { DEMO_BROWSE_BUDGETS } from '@/data/demoData'
import { formatBudgetRange } from '@/helpers/formatBudgetRange'
import { formatRelativeTime } from '@/helpers/formatRelativeTime'

export const PUBLIC_JOBS_PAGE_SIZE = 6

const STATUS_MAP = {
  OPEN: { label: 'Open', variant: 'open' },
  IN_PROGRESS: { label: 'In Progress', variant: 'inProgress' },
  COMPLETED: { label: 'Completed', variant: 'completed' },
  CANCELLED: { label: 'Cancelled', variant: 'cancelled' },
}

const URGENCY_MAP = {
  HIGH: { label: 'High Urgency', variant: 'high' },
  MEDIUM: { label: 'Medium Urgency', variant: 'medium' },
  LOW: { label: 'Low Urgency', variant: 'low' },
}

function formatDisplayDate(value) {
  if (!value) return 'Not specified'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not specified'

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function buildDescription(description = '') {
  const full = description?.trim() || 'No description provided.'

  if (full.length <= 240) {
    return { summary: full, full }
  }

  const truncated = full.slice(0, 240).replace(/\s+\S*$/, '')
  return { summary: `${truncated}...`, full }
}

function mapStatus(status) {
  return STATUS_MAP[status] ?? { label: status || 'Open', variant: 'open' }
}

function mapUrgency(urgency) {
  return URGENCY_MAP[urgency] ?? { label: urgency || 'Standard', variant: 'medium' }
}

export const ALL_CATEGORIES_OPTION = { label: 'All Trade Categories', slug: '' }

export const BUDGET_FILTER_OPTIONS = [
  { label: DEMO_BROWSE_BUDGETS[0], min: 0, max: 100 },
  { label: DEMO_BROWSE_BUDGETS[1], min: 100, max: 250 },
  { label: DEMO_BROWSE_BUDGETS[2], min: 250, max: 500 },
  { label: DEMO_BROWSE_BUDGETS[3], min: 500, max: 1000 },
  { label: DEMO_BROWSE_BUDGETS[4], min: 1000, max: 4000 },
  { label: DEMO_BROWSE_BUDGETS[5], min: 4000, max: null },
]

const MAX_API_PAGE_SIZE = 50

export function isPublicJobsApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

export function getBudgetOption(budgetLabel) {
  return BUDGET_FILTER_OPTIONS.find((option) => option.label === budgetLabel) ?? null
}

/**
 * Each job belongs to exactly one bucket, chosen by its maximum budget.
 * Buckets are (min, max], except the first which also includes 0.
 */
export function jobMatchesBudget(budgetMin, budgetMax, budgetLabel) {
  const option = getBudgetOption(budgetLabel)
  if (!option) return true

  const top = Number(budgetMax ?? budgetMin)
  if (!Number.isFinite(top)) return false

  const aboveMin = option.min === 0 ? top >= 0 : top > option.min
  const belowMax = option.max == null ? true : top <= option.max
  return aboveMin && belowMax
}

export function getFallbackJobCategories() {
  return [
    ALL_CATEGORIES_OPTION,
    ...DEFAULT_TRADE_CATEGORIES.map((category) => ({
      label: category.name,
      slug: category.id,
    })),
  ]
}

export function mapApiJobToCard(job) {
  const location = job.location || job.city || 'Location not specified'
  const city = job.city ?? ''
  const tokenCost =
    job.tokenCost ??
    job.tokensRequired ??
    (job.leadPrice != null ? Math.round(Number(job.leadPrice)) : null)

  return {
    id: job.id,
    title: job.title,
    location,
    city,
    priceRange: formatBudgetRange(job.budgetMin, job.budgetMax),
    postedAt: formatRelativeTime(job.createdAt),
    category: job.category?.name ?? '',
    image: job.images?.[0]?.url ?? null,
    status: job.status ?? null,
    tokenCost,
    leadPrice: job.leadPrice,
  }
}

export function mapApiJobToDetails(job) {
  const status = mapStatus(job.status)
  const urgency = mapUrgency(job.urgency)
  const customerName = job.customer?.fullName || job.customer?.firstName || 'Customer'
  const location = job.location || job.city || 'Location not specified'
  const city = job.city ?? ''

  return {
    id: job.id,
    jobCode: job.jobCode,
    status: status.label,
    statusVariant: status.variant,
    statusCode: String(job.status ?? '').trim().toUpperCase() || 'OPEN',
    category: job.category?.name ?? '',
    urgency: urgency.label,
    urgencyVariant: urgency.variant,
    postedAt: formatRelativeTime(job.createdAt),
    title: job.title,
    location,
    city,
    price: formatBudgetRange(job.budgetMin, job.budgetMax),
    leadPrice: job.leadPrice,
    quoteCount: job._count?.quotes ?? 0,
    customer: job.customer
      ? {
          id: job.customer.id ?? job.customerId ?? null,
          name: customerName,
          avatar: job.customer.profileImage ?? null,
          phone: job.customer.phoneNumber ?? job.customer.phone ?? null,
          email: job.customer.email ?? null,
        }
      : null,
    tradesman: job.tradesman
      ? {
          name: job.tradesman.fullName || job.tradesman.firstName,
          initials: (job.tradesman.firstName || job.tradesman.fullName || 'T').charAt(0),
          avatar: job.tradesman.profileImage ?? null,
          rating: job.tradesman.rating ?? 0,
          reviewCount: job.tradesman.reviewCount ?? 0,
          jobsCompleted: job.tradesman.jobsCompleted ?? 0,
          yearsExperience: job.tradesman.yearsExperience ?? 0,
          location: job.tradesman.location ?? job.city ?? '',
        }
      : null,
    description: buildDescription(job.description),
    requirements: (job.requirements ?? []).map((item) =>
      typeof item === 'string' ? item : item.text,
    ),
    preferredStart: formatDisplayDate(job.preferredStart),
    completionBy: formatDisplayDate(job.completionBy),
    specialNotes: job.specialNotes ?? '',
    photos: (job.images ?? []).map((image, index) => ({
      src: image.url,
      alt: `${job.title} photo ${index + 1}`,
    })),
  }
}

function buildJobsQuery({
  categorySlug,
  location,
  search,
  minBudget,
  page,
  limit,
  status = 'OPEN',
}) {
  const params = new URLSearchParams()

  if (categorySlug) params.set('category', categorySlug)
  if (location?.trim()) params.set('location', location.trim())
  if (search?.trim()) params.set('search', search.trim())
  if (status) params.set('status', status)
  if (minBudget) params.set('minBudget', String(minBudget))

  params.set('page', String(page))
  params.set('limit', String(limit))

  return params.toString()
}

export async function fetchJobCategories() {
  try {
    const payload = await apiRequest('/api/categories')
    const items = payload?.data ?? payload ?? []

    if (!Array.isArray(items) || !items.length) {
      return getFallbackJobCategories()
    }

    return [
      ALL_CATEGORIES_OPTION,
      ...items.map((category) => ({
        label: category.name,
        slug: category.slug ?? category.id,
      })),
    ]
  } catch {
    return getFallbackJobCategories()
  }
}

function normalizePagination(payload, { page, limit, rowsLength }) {
  const raw = payload?.pagination ?? payload?.meta ?? {}
  const total = raw.total ?? raw.totalCount ?? raw.totalItems ?? rowsLength
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

export async function fetchPublicJobs({
  categorySlug = '',
  location = '',
  search = '',
  budgetLabel = '',
  page = 1,
  limit = PUBLIC_JOBS_PAGE_SIZE,
  status = 'OPEN',
  token,
} = {}) {
  // Marketplace browse is OPEN-only for public + tradesman.
  const marketplaceStatus = status || 'OPEN'
  const isOpen = (job) => String(job.status ?? 'OPEN').trim().toUpperCase() === 'OPEN'
  const budgetOption = getBudgetOption(budgetLabel)

  if (budgetOption) {
    const baseQuery = {
      categorySlug,
      location,
      search,
      minBudget: budgetOption.min,
      limit: MAX_API_PAGE_SIZE,
      status: marketplaceStatus,
    }

    const all = []
    let apiPage = 1
    let apiTotalPages = 1

    do {
      const payload = await apiRequest(
        `/api/jobs?${buildJobsQuery({ ...baseQuery, page: apiPage })}`,
        { token },
      )
      const rows = payload?.data ?? []
      all.push(...rows)
      apiTotalPages = normalizePagination(payload, {
        page: apiPage,
        limit: MAX_API_PAGE_SIZE,
        rowsLength: rows.length,
      }).totalPages
      if (!rows.length) break
      apiPage += 1
    } while (apiPage <= apiTotalPages)

    const matched = all.filter(
      (job) => isOpen(job) && jobMatchesBudget(job.budgetMin, job.budgetMax, budgetLabel),
    )
    const total = matched.length
    const start = (page - 1) * limit

    return {
      jobs: matched.slice(start, start + limit).map(mapApiJobToCard),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    }
  }

  const query = buildJobsQuery({
    categorySlug,
    location,
    search,
    page,
    limit,
    status: marketplaceStatus,
  })

  const payload = await apiRequest(`/api/jobs?${query}`, { token })
  const rows = payload?.data ?? []
  const openOnly = rows.filter(isOpen)
  const pagination = normalizePagination(payload, {
    page,
    limit,
    rowsLength: openOnly.length,
  })

  return {
    jobs: openOnly.map(mapApiJobToCard),
    pagination,
  }
}

export async function fetchPublicJobDetails(jobId, { token } = {}) {
  if (!jobId) {
    throw new Error('Job not found.')
  }

  const payload = await apiRequest(`/api/jobs/${encodeURIComponent(jobId)}`, { token })
  const job = payload?.data

  if (!job) {
    throw new Error('Job not found.')
  }

  return mapApiJobToDetails(job)
}
