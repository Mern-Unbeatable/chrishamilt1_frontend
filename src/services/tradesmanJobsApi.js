import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  countActiveTradesmanJobs,
  DEMO_TRADESMAN_JOBS_LIST,
  filterTradesmanJobsByStatus,
} from '@/data/tradesmanJobsData'
import { fetchPublicJobDetails } from '@/services/publicJobsApi'

export const TRADESMAN_JOBS_PAGE_SIZE = 7

const BOOKING_STATUS_TO_UI = {
  ACCEPTED: 'Accepted',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

const UI_FILTER_TO_API_STATUS = {
  completed: 'COMPLETED',
  accepted: 'ACCEPTED',
  'in progress': 'IN_PROGRESS',
}

const UI_STATUS_TO_API = {
  Accepted: 'ACCEPTED',
  'In progress': 'IN_PROGRESS',
  Completed: 'COMPLETED',
}

function formatCurrency(value) {
  const amount = Number(value ?? 0)
  return `£${amount.toLocaleString('en-GB')}`
}

function mapBookingStatus(status) {
  return BOOKING_STATUS_TO_UI[status] ?? status ?? 'Accepted'
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

export function isTradesmanJobsApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

export function mapApiTradesmanJobToRow(job = {}) {
  return {
    id: job.id,
    bookingId: job.bookingId,
    jobId: job.jobCode ?? job.id,
    title: job.title ?? '',
    customerName: job.customerName ?? 'Customer',
    customerId: job.customerId ?? null,
    phoneNumber: job.phoneNumber ?? '—',
    price: formatCurrency(job.price),
    status: mapBookingStatus(job.status),
    apiStatus: job.status,
    scheduledAt: job.scheduledAt ?? null,
    location: job.location ?? '',
  }
}

export async function fetchTradesmanJobs({
  page = 1,
  limit = TRADESMAN_JOBS_PAGE_SIZE,
  statusFilter = 'all',
} = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))

  const apiStatus = UI_FILTER_TO_API_STATUS[statusFilter]
  if (apiStatus) params.set('status', apiStatus)

  const payload = await apiRequest(`/api/tradesman/jobs?${params.toString()}`, {
    token: getAccessToken(),
  })

  const rows = payload?.data ?? []
  const pagination = normalizePagination(payload, { page, limit, rowsLength: rows.length })

  return {
    jobs: rows.map(mapApiTradesmanJobToRow),
    pagination,
  }
}

export async function updateTradesmanJobStatus(jobId, uiStatus) {
  const apiStatus = UI_STATUS_TO_API[uiStatus]
  if (!apiStatus) {
    throw new Error('Invalid job status.')
  }

  const payload = await apiRequest(`/api/tradesman/jobs/${encodeURIComponent(jobId)}/status`, {
    method: 'PATCH',
    token: getAccessToken(),
    body: { status: apiStatus },
  })

  const booking = payload?.data ?? payload
  if (!booking) {
    throw new Error('Unable to update job status.')
  }

  const job = booking.job ?? {}
  return mapApiTradesmanJobToRow({
    id: job.id ?? jobId,
    bookingId: booking.id,
    jobCode: job.jobCode,
    title: job.title,
    customerName: booking.customer?.fullName,
    customerId: booking.customerId,
    phoneNumber: booking.customer?.phoneNumber,
    price: booking.price,
    status: booking.status,
    scheduledAt: booking.scheduledAt,
    location: job.location,
  })
}

export async function fetchTradesmanJobDetails(jobId) {
  const job = await fetchPublicJobDetails(jobId, { token: getAccessToken() })
  return job
}

export async function fetchTradesmanActiveJobsCount() {
  const payload = await apiRequest('/api/tradesman/dashboard', {
    token: getAccessToken(),
  })

  const dashboard = payload?.data ?? payload
  return Number(dashboard?.activeJobs ?? 0)
}

export function getDemoTradesmanJobsPage(page = 1, pageSize = TRADESMAN_JOBS_PAGE_SIZE, statusFilter = 'all') {
  const filtered = filterTradesmanJobsByStatus(DEMO_TRADESMAN_JOBS_LIST, statusFilter)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize

  return {
    jobs: filtered.slice(start, start + pageSize),
    pagination: {
      page,
      limit: pageSize,
      total,
      totalPages,
    },
    activeProjects: countActiveTradesmanJobs(DEMO_TRADESMAN_JOBS_LIST),
  }
}
