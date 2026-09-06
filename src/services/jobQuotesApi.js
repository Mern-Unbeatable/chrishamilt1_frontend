import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'
import { formatRelativeTime } from '@/helpers/formatRelativeTime'
import { getJobQuotes as getFallbackJobQuotes } from '@/data/jobQuotesData'

export function isJobQuotesApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
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
    month: 'short',
    year: 'numeric',
  })
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'TR'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function mapApiQuoteToCustomerCard(quote = {}) {
  const tradesman = quote.tradesman ?? {}
  const profile = tradesman.tradesmanProfile ?? {}
  const job = quote.job ?? null

  const tradesmanName =
    tradesman.fullName ||
    [tradesman.firstName, tradesman.lastName].filter(Boolean).join(' ') ||
    profile.businessName ||
    'Tradesman'

  const statusVariant = (quote.status || 'submitted').toLowerCase()

  return {
    id: quote.id,
    jobId: quote.jobId,
    amount: formatCurrency(quote.amount),
    amountValue: Number(quote.amount ?? 0),
    duration: quote.estimatedDuration || '—',
    startDate: formatDisplayDate(quote.startDate),
    distance: profile.location || tradesman.address || tradesman.city || '—',
    responseTime: profile.responseTimeHours
      ? `${profile.responseTimeHours}h`
      : 'Within 24h',
    submittedAt: quote.createdAt
      ? `Submitted ${formatRelativeTime(quote.createdAt)}`
      : 'Submitted',
    status: quote.status || 'SUBMITTED',
    statusVariant,
    proposalPreview:
      quote.proposalPreview || quote.proposal || 'No proposal preview available.',
    fullProposal:
      quote.proposal || quote.proposalPreview || 'No full proposal provided.',
    materialsIncluded: Boolean(quote.materialsIncluded),
    materialsLabel: quote.materialsIncluded ? 'Included' : 'Not Included',
    warranty: quote.warranty || '',
    warrantyDays: 0,
    specialties: Array.isArray(profile.specialties) ? profile.specialties : [],
    images: Array.isArray(quote.images) ? quote.images : [],
    reviews: Array.isArray(quote.reviews) ? quote.reviews : [],
    job,
    tradesman: {
      id: tradesman.id,
      name: tradesmanName,
      initials: getInitials(tradesmanName),
      avatar: tradesman.profileImage || null,
      rating: Number(profile.averageRating ?? 0),
      reviewCount: Number(profile.totalReviews ?? 0),
      jobsCompleted: Number(profile.jobsCompleted ?? 0),
      yearsExperience: Number(profile.yearsExperience ?? 0),
      phoneNumber: tradesman.phoneNumber || '',
      email: tradesman.email || '',
      businessName: profile.businessName || '',
    },
  }
}

export async function fetchJobQuotes(jobId) {
  if (!jobId) {
    throw new Error('Job ID is required.')
  }

  const payload = await apiRequest(`/api/jobs/${encodeURIComponent(jobId)}/quotes`, {
    token: getAccessToken(),
  })

  const rows = payload?.data ?? []
  const quotes = rows.map(mapApiQuoteToCustomerCard)
  const job = quotes[0]?.job ?? null

  return {
    quotes,
    job,
  }
}

export function getDemoQuotesForJob(jobId) {
  return getFallbackJobQuotes(jobId)
}

