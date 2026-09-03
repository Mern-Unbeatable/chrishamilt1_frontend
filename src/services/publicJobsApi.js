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
  { label: DEMO_BROWSE_BUDGETS[0], params: {} },
  { label: DEMO_BROWSE_BUDGETS[1], params: { maxBudget: 1000 } },
  { label: DEMO_BROWSE_BUDGETS[2], params: { minBudget: 1000, maxBudget: 5000 } },
  { label: DEMO_BROWSE_BUDGETS[3], params: { minBudget: 5000, maxBudget: 10000 } },
  { label: DEMO_BROWSE_BUDGETS[4], params: { minBudget: 10000 } },
]

export function isPublicJobsApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

export function getBudgetParams(budgetLabel) {
  return BUDGET_FILTER_OPTIONS.find((option) => option.label === budgetLabel)?.params ?? {}
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
  return {
    id: job.id,
    title: job.title,
    location: job.location,
    priceRange: formatBudgetRange(job.budgetMin, job.budgetMax),
    postedAt: formatRelativeTime(job.createdAt),
    category: job.category?.name ?? 'General',
    image: job.images?.[0]?.url ?? null,
  }
}

export function mapApiJobToDetails(job) {
  const status = mapStatus(job.status)
  const urgency = mapUrgency(job.urgency)
  const customerName = job.customer?.fullName || job.customer?.firstName || 'Customer'

  return {
    id: job.id,
    jobCode: job.jobCode,
    status: status.label,
    statusVariant: status.variant,
    category: job.category?.name ?? 'General',
    urgency: urgency.label,
    urgencyVariant: urgency.variant,
    postedAt: formatRelativeTime(job.createdAt),
    title: job.title,
    location: job.location,
    price: formatBudgetRange(job.budgetMin, job.budgetMax),
    leadPrice: job.leadPrice,
    quoteCount: job._count?.quotes ?? 0,
    customer: job.customer
      ? {
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
  budgetLabel,
  page,
  limit,
}) {
  const params = new URLSearchParams()

  if (categorySlug) params.set('category', categorySlug)
  if (location?.trim()) params.set('location', location.trim())
  if (search?.trim()) params.set('search', search.trim())

  const budgetParams = getBudgetParams(budgetLabel)
  Object.entries(budgetParams).forEach(([key, value]) => {
    params.set(key, String(value))
  })

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

export async function fetchPublicJobs({
  categorySlug = '',
  location = '',
  search = '',
  budgetLabel = DEMO_BROWSE_BUDGETS[0],
  page = 1,
  limit = PUBLIC_JOBS_PAGE_SIZE,
} = {}) {
  const query = buildJobsQuery({
    categorySlug,
    location,
    search,
    budgetLabel,
    page,
    limit,
  })

  const payload = await apiRequest(`/api/jobs?${query}`)
  const rows = payload?.data ?? []
  const pagination = payload?.pagination ?? {
    page,
    limit,
    total: rows.length,
    totalPages: Math.max(1, Math.ceil(rows.length / limit)),
  }

  return {
    jobs: rows.map(mapApiJobToCard),
    pagination,
  }
}

export async function fetchPublicJobDetails(jobId) {
  if (!jobId) {
    throw new Error('Job not found.')
  }

  const payload = await apiRequest(`/api/jobs/${encodeURIComponent(jobId)}`)
  const job = payload?.data

  if (!job) {
    throw new Error('Job not found.')
  }

  return mapApiJobToDetails(job)
}
