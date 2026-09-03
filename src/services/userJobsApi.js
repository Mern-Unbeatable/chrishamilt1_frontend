import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'
import { DEFAULT_TRADE_CATEGORIES } from '@/data/categoriesData'
import { formatBudgetRange } from '@/helpers/formatBudgetRange'
import { formatRelativeTime } from '@/helpers/formatRelativeTime'
import { formatDateInputValue, parseDateInputValue } from '@/helpers/validateJobDates'

export const MY_JOBS_PAGE_SIZE = 6

export const MY_JOB_STATUS_FILTERS = [
  { label: 'All jobs', value: '' },
  { label: 'Open', value: 'OPEN' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'In progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

const URGENCY_TO_API = {
  'High Urgency': 'HIGH',
  'Within 2 weeks': 'MEDIUM',
  'Flexible date': 'LOW',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
}

const URGENCY_FROM_API = {
  HIGH: 'High Urgency',
  MEDIUM: 'Within 2 weeks',
  LOW: 'Flexible date',
}

function toDateInputValue(value) {
  if (!value) return ''

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return parseDateInputValue(value) ? value : ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return formatDateInputValue(date)
}

function buildJobFormData({
  title,
  description,
  categoryId,
  location,
  city,
  budgetMin,
  budgetMax,
  urgency,
  preferredStart,
  completionBy,
  specialNotes = '',
  requirements = '',
  files = [],
}) {
  const formData = new FormData()

  formData.append('title', title.trim())
  formData.append('description', description.trim())
  formData.append('categoryId', categoryId)
  formData.append('location', location.trim())
  formData.append('city', (city || extractCityFromLocation(location)).trim())
  formData.append('budgetMin', String(budgetMin))
  formData.append('budgetMax', String(budgetMax))
  formData.append('urgency', mapUrgencyToApi(urgency))
  formData.append('preferredStart', preferredStart)
  formData.append('completionBy', completionBy)

  if (specialNotes.trim()) {
    formData.append('specialNotes', specialNotes.trim())
  }

  if (requirements.trim()) {
    formData.append('requirements', requirements.trim())
  }

  files.forEach((file) => {
    if (file instanceof File) {
      formData.append('images', file)
    }
  })

  return formData
}

export function isUserJobsApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

export function mapUrgencyToApi(urgency) {
  return URGENCY_TO_API[urgency] ?? 'MEDIUM'
}

export function extractCityFromLocation(location = '') {
  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length > 1) return parts[parts.length - 1]
  return parts[0] || ''
}

export function getFallbackPostJobCategories() {
  return DEFAULT_TRADE_CATEGORIES.map((category) => ({
    id: category.id,
    name: category.name,
  }))
}

export async function fetchPostJobCategories() {
  const payload = await apiRequest('/api/categories')
  const items = payload?.data ?? payload ?? []

  if (!Array.isArray(items) || !items.length) {
    throw new Error('No job categories are available right now.')
  }

  return items.map((category) => ({
    id: category.id,
    name: category.name,
  }))
}

export async function createUserJob({
  title,
  description,
  categoryId,
  location,
  city,
  budgetMin,
  budgetMax,
  urgency,
  preferredStart,
  completionBy,
  specialNotes = '',
  requirements = '',
  files = [],
}) {
  const formData = buildJobFormData({
    title,
    description,
    categoryId,
    location,
    city,
    budgetMin,
    budgetMax,
    urgency,
    preferredStart,
    completionBy,
    specialNotes,
    requirements,
    files,
  })

  const payload = await apiRequest('/api/jobs', {
    method: 'POST',
    body: formData,
    token: getAccessToken(),
  })

  return payload?.data ?? payload
}

export function mapApiJobToFormValues(job) {
  return {
    categoryId: job.categoryId ?? job.category?.id ?? '',
    title: job.title ?? '',
    description: job.description ?? '',
    location: job.location ?? '',
    city: job.city ?? '',
    budgetMin: job.budgetMin ?? '',
    budgetMax: job.budgetMax ?? '',
    urgency: URGENCY_FROM_API[job.urgency] ?? 'Within 2 weeks',
    preferredStart: toDateInputValue(job.preferredStart),
    completionBy: toDateInputValue(job.completionBy),
    specialInstruction: job.specialNotes ?? '',
    requirements: (job.requirements ?? [])
      .map((item) => (typeof item === 'string' ? item : item.text))
      .filter(Boolean)
      .join('\n'),
    existingImages: (job.images ?? []).map((image) => ({
      id: image.id,
      url: image.url,
    })),
  }
}

export async function fetchUserJob(jobId) {
  if (!jobId) {
    throw new Error('Job not found.')
  }

  const payload = await apiRequest(`/api/jobs/${encodeURIComponent(jobId)}`, {
    token: getAccessToken(),
  })

  const job = payload?.data
  if (!job) {
    throw new Error('Job not found.')
  }

  return mapApiJobToFormValues(job)
}

export async function updateUserJob(
  jobId,
  {
    title,
    description,
    categoryId,
    location,
    city,
    budgetMin,
    budgetMax,
    urgency,
    preferredStart,
    completionBy,
    specialNotes = '',
    requirements = '',
    files = [],
  },
) {
  if (!jobId) {
    throw new Error('Job not found.')
  }

  const formData = buildJobFormData({
    title,
    description,
    categoryId,
    location,
    city,
    budgetMin,
    budgetMax,
    urgency,
    preferredStart,
    completionBy,
    specialNotes,
    requirements,
    files,
  })

  const payload = await apiRequest(`/api/jobs/${encodeURIComponent(jobId)}`, {
    method: 'PUT',
    body: formData,
    token: getAccessToken(),
  })

  return payload?.data ?? payload
}

export function mapApiJobToPostedCard(job) {
  return {
    id: job.id,
    jobCode: job.jobCode,
    title: job.title,
    location: job.location,
    priceRange: formatBudgetRange(job.budgetMin, job.budgetMax),
    postedAt: formatRelativeTime(job.createdAt),
    category: job.category?.name ?? 'General',
    image: job.images?.[0]?.url ?? null,
    status: job.status,
    quoteCount: job._count?.quotes ?? 0,
  }
}

export async function fetchMyJobs({
  status = '',
  page = 1,
  limit = MY_JOBS_PAGE_SIZE,
} = {}) {
  const params = new URLSearchParams()

  if (status) params.set('status', status)
  params.set('page', String(page))
  params.set('limit', String(limit))

  const payload = await apiRequest(`/api/jobs/mine?${params.toString()}`, {
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
    jobs: rows.map(mapApiJobToPostedCard),
    pagination,
  }
}

export async function deleteUserJob(jobId) {
  if (!jobId) {
    throw new Error('Job not found.')
  }

  await apiRequest(`/api/jobs/${encodeURIComponent(jobId)}`, {
    method: 'DELETE',
    token: getAccessToken(),
  })
}
