import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'
import { canCancelBooking, DEMO_MY_BOOKINGS } from '@/data/myBookingsData'

export const USER_BOOKINGS_PAGE_SIZE = 3

const BOOKING_STATUS_TO_UI = {
  ACCEPTED: 'Accepted',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

const BOOKING_STATUS_VARIANTS = {
  completed: 'completed',
  accepted: 'open',
  'in progress': 'inProgress',
  'in-progress': 'inProgress',
  cancelled: 'cancelled',
}

function formatCurrency(value) {
  const amount = Number(value ?? 0)
  return `£${amount.toLocaleString('en-GB')}`
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

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'TR'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function mapBookingStatus(status) {
  return BOOKING_STATUS_TO_UI[status] ?? status ?? 'Accepted'
}

function getStatusVariant(status) {
  const key = String(status).trim().toLowerCase()
  return BOOKING_STATUS_VARIANTS[key] ?? 'open'
}

function formatScheduledDateTime(scheduledAt) {
  if (!scheduledAt) {
    return { date: '—', time: '—' }
  }

  const value = new Date(scheduledAt)
  if (Number.isNaN(value.getTime())) {
    return { date: '—', time: '—' }
  }

  return {
    date: value.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
    time: value.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  }
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

export function isUserBookingsApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

export function mapApiBookingToCard(booking = {}) {
  const job = booking.job ?? {}
  const scheduled = formatScheduledDateTime(booking.scheduledAt)
  const status = mapBookingStatus(booking.status)

  return {
    id: booking.id,
    jobId: booking.jobId,
    tradesmanId: booking.tradesmanId ?? booking.tradesman?.id ?? null,
    title: job.title ?? 'Booking',
    location: job.location ?? job.city ?? '—',
    price: formatCurrency(booking.price),
    status,
    date: scheduled.date,
    time: scheduled.time,
    image: job.images?.[0]?.url ?? null,
  }
}

export function mapApiBookingToDetails(booking = {}) {
  const job = booking.job ?? {}
  const tradesman = booking.tradesman ?? {}
  const profile = tradesman.tradesmanProfile ?? {}
  const status = mapBookingStatus(booking.status)
  const tradesmanName =
    tradesman.fullName ||
    profile.businessName ||
    [tradesman.firstName, tradesman.lastName].filter(Boolean).join(' ') ||
    'Tradesman'

  return {
    id: booking.id,
    jobId: booking.jobId,
    tradesmanId: booking.tradesmanId ?? tradesman.id ?? null,
    title: job.title ?? 'Booking',
    location: job.location ?? job.city ?? '—',
    price: formatCurrency(booking.price),
    status,
    statusVariant: getStatusVariant(status),
    tradesman: {
      id: tradesman.id ?? null,
      name: tradesmanName,
      initials: getInitials(tradesmanName),
      avatar: tradesman.profileImage ?? null,
      rating: Number(profile.averageRating ?? 0),
      reviewCount: Number(profile.totalReviews ?? 0),
      jobsCompleted: Number(profile.jobsCompleted ?? 0),
      yearsExperience: Number(profile.yearsExperience ?? 0),
      location: profile.location || tradesman.city || tradesman.address || '',
    },
    description: buildDescription(job.description),
    requirements: (job.requirements ?? []).map((item) =>
      typeof item === 'string' ? item : item.text,
    ),
    preferredStart: formatDisplayDate(job.preferredStart),
    completionBy: formatDisplayDate(job.completionBy),
    specialNotes: job.specialNotes ?? '',
    hasReviewed: Boolean(booking.hasReviewed),
    photos: (job.images ?? []).map((image, index) => ({
      src: image.url,
      alt: `${job.title ?? 'Job'} photo ${index + 1}`,
    })),
  }
}

export async function fetchUserBookings({ page = 1, limit = USER_BOOKINGS_PAGE_SIZE } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))

  const payload = await apiRequest(`/api/bookings?${params.toString()}`, {
    token: getAccessToken(),
  })

  const rows = payload?.data ?? []
  const pagination = normalizePagination(payload, { page, limit, rowsLength: rows.length })

  return {
    bookings: rows.map(mapApiBookingToCard),
    pagination,
  }
}

export async function fetchUserBookingDetails(bookingId) {
  if (!bookingId) {
    throw new Error('Booking not found.')
  }

  const payload = await apiRequest(`/api/bookings/${encodeURIComponent(bookingId)}`, {
    token: getAccessToken(),
  })

  const booking = payload?.data ?? payload
  if (!booking?.id) {
    throw new Error('Booking not found.')
  }

  return mapApiBookingToDetails(booking)
}

export async function cancelUserBooking(bookingId) {
  if (!bookingId) {
    throw new Error('Booking not found.')
  }

  const payload = await apiRequest(`/api/bookings/${encodeURIComponent(bookingId)}/cancel`, {
    method: 'PATCH',
    token: getAccessToken(),
  })

  const booking = payload?.data ?? payload
  return mapApiBookingToCard(booking)
}

export { canCancelBooking }

export function getDemoUserBookingsPage(page = 1, pageSize = USER_BOOKINGS_PAGE_SIZE) {
  const total = DEMO_MY_BOOKINGS.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize

  return {
    bookings: DEMO_MY_BOOKINGS.slice(start, start + pageSize),
    pagination: {
      page,
      limit: pageSize,
      total,
      totalPages,
    },
  }
}
