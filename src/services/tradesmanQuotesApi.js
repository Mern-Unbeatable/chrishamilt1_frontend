import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'
import { formatRelativeTime } from '@/helpers/formatRelativeTime'
import {
  DEMO_TRADESMAN_QUOTES,
  DEMO_TRADESMAN_QUOTES_SUMMARY,
  getTradesmanQuote,
} from '@/data/tradesmanQuotesData'

export const TRADESMAN_QUOTES_PAGE_SIZE = 10

const QUOTE_STATUS_MAP = {
  SUBMITTED: { label: 'Submitted', variant: 'submitted' },
  ACCEPTED: { label: 'Accepted', variant: 'accepted' },
  REJECTED: { label: 'Rejected', variant: 'rejected' },
  WITHDRAWN: { label: 'Withdrawn', variant: 'withdrawn' },
  PENDING: { label: 'Pending', variant: 'pending' },
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

function toDateInputValue(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toISOString().slice(0, 10)
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

export function isTradesmanQuotesApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

export function mapApiQuoteToCard(quote) {
  const status =
    QUOTE_STATUS_MAP[quote.status] ??
    { label: quote.status || 'Submitted', variant: 'submitted' }
  const job = quote.job ?? {}
  const customer = job.customer ?? {}

  return {
    id: quote.id,
    quoteId: job.jobCode ?? quote.id.slice(0, 8),
    status: status.label,
    statusVariant: status.variant,
    postedAt: formatRelativeTime(quote.createdAt),
    amount: formatCurrency(quote.amount),
    title: job.title ?? 'Untitled job',
    customerName: customer.fullName || customer.firstName || 'Customer',
    customerId: customer.id ?? job.customerId ?? null,
    duration: quote.estimatedDuration ?? '—',
    tokensUsed: job.leadPrice ?? 0,
    description: quote.proposalPreview ?? quote.proposal ?? '',
    jobId: quote.jobId ?? job.id,
    amountValue: Number(quote.amount ?? 0),
    startDateInput: toDateInputValue(quote.startDate),
    fullProposal: quote.proposal ?? quote.proposalPreview ?? '',
    startDate: formatDisplayDate(quote.startDate),
    materialsIncluded: Boolean(quote.materialsIncluded),
    warranty: quote.warranty ?? '',
    images: quote.images ?? [],
  }
}

export function mapQuoteCardToFormValues(quote = {}) {
  const parsedAmount = Number(String(quote.amount ?? '').replace(/[^\d.]/g, ''))
  const amountValue =
    quote.amountValue ?? (Number.isFinite(parsedAmount) ? parsedAmount : '')

  return {
    quoteAmount: amountValue === '' ? '' : String(amountValue),
    duration: quote.duration ?? '',
    startDate: quote.startDateInput ?? '',
    materialsIncluded: Boolean(quote.materialsIncluded),
    warranty: quote.warranty ?? '',
    proposal: quote.fullProposal ?? quote.description ?? '',
    attachmentTypes: [],
    images: [],
    existingImages: Array.isArray(quote.images) ? quote.images : [],
  }
}

export function buildQuoteFormData(form = {}) {
  const formData = new FormData()
  const amount = Number(form.quoteAmount)

  formData.append('amount', String(Number.isFinite(amount) ? amount : 0))
  formData.append('estimatedDuration', form.duration?.trim() ?? '')
  formData.append('startDate', form.startDate ?? '')
  formData.append('materialsIncluded', String(Boolean(form.materialsIncluded)))
  formData.append('warranty', form.warranty?.trim() ?? '')
  formData.append('proposal', form.proposal?.trim() ?? '')

  const files = Array.isArray(form.images) ? form.images : []
  files.forEach((file) => {
    if (file instanceof File) {
      formData.append('images', file)
    }
  })

  return formData
}

export function buildQuoteUpdateBody(form = {}) {
  return buildQuoteFormData(form)
}

export function validateQuoteForm(form = {}) {
  const amount = Number(form.quoteAmount)

  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Enter a valid quote amount.'
  }

  if (!form.duration?.trim()) {
    return 'Estimated duration is required.'
  }

  if (!form.startDate?.trim()) {
    return 'Available start date is required.'
  }

  if ((form.proposal?.trim().length ?? 0) < 100) {
    return 'Your proposal must be at least 100 characters.'
  }

  return ''
}

export const validateQuoteUpdateForm = validateQuoteForm

export async function submitJobQuote(jobId, form) {
  if (!jobId) {
    throw new Error('Job not found.')
  }

  const payload = await apiRequest(
    `/api/jobs/${encodeURIComponent(jobId)}/quotes`,
    {
      method: 'POST',
      body: buildQuoteFormData(form),
      token: getAccessToken(),
    },
  )

  const quote = payload?.data ?? payload
  if (!quote?.id) {
    throw new Error('Unable to submit quote.')
  }

  return mapApiQuoteToCard(quote)
}

export async function updateQuote(quoteId, form) {
  if (!quoteId) {
    throw new Error('Quote not found.')
  }

  const payload = await apiRequest(`/api/quotes/${encodeURIComponent(quoteId)}`, {
    method: 'PUT',
    body: buildQuoteFormData(form),
    token: getAccessToken(),
  })

  const quote = payload?.data ?? payload
  if (!quote?.id) {
    throw new Error('Unable to update quote.')
  }

  return mapApiQuoteToCard(quote)
}

export async function withdrawQuote(quoteId) {
  if (!quoteId) {
    throw new Error('Quote not found.')
  }

  const payload = await apiRequest(
    `/api/quotes/${encodeURIComponent(quoteId)}/withdraw`,
    {
      method: 'PATCH',
      token: getAccessToken(),
    },
  )

  const quote = payload?.data ?? payload
  if (quote?.id) {
    return mapApiQuoteToCard(quote)
  }

  return {
    id: quoteId,
    status: 'Withdrawn',
    statusVariant: 'withdrawn',
  }
}

export async function fetchQuoteDetails(quoteId, { jobId } = {}) {
  if (!quoteId) {
    throw new Error('Quote not found.')
  }

  if (jobId) {
    const payload = await apiRequest(
      `/api/jobs/${encodeURIComponent(jobId)}/quotes`,
      { token: getAccessToken() },
    )

    const rows = payload?.data ?? []
    const quote = rows.find((item) => item.id === quoteId)

    if (quote) {
      return mapApiQuoteToCard(quote)
    }
  }

  const payload = await apiRequest(`/api/quotes/${encodeURIComponent(quoteId)}`, {
    token: getAccessToken(),
  })

  const quote = payload?.data
  if (!quote) {
    throw new Error('Quote not found.')
  }

  return mapApiQuoteToCard(quote)
}

export async function fetchMyQuotes({
  page = 1,
  limit = TRADESMAN_QUOTES_PAGE_SIZE,
} = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))

  const payload = await apiRequest(`/api/quotes/mine?${params.toString()}`, {
    token: getAccessToken(),
  })

  const rows = payload?.data ?? []
  const pagination = normalizePagination(payload, { page, limit, rowsLength: rows.length })

  return {
    quotes: rows.map(mapApiQuoteToCard),
    pagination,
  }
}

export function getDemoTradesmanQuotesSummary(total = DEMO_TRADESMAN_QUOTES.length) {
  return {
    submittedThisMonth: DEMO_TRADESMAN_QUOTES_SUMMARY.submittedThisMonth,
    total,
  }
}

export function getDemoTradesmanQuoteDetails(quoteId) {
  const quote = getTradesmanQuote(quoteId)
  if (!quote) return null

  return {
    ...quote,
    fullProposal: quote.fullProposal ?? quote.description ?? '',
  }
}

export function getDemoTradesmanQuotesPage(page = 1, limit = TRADESMAN_QUOTES_PAGE_SIZE) {
  const start = (page - 1) * limit
  const quotes = DEMO_TRADESMAN_QUOTES.slice(start, start + limit)

  return {
    quotes,
    pagination: {
      page,
      limit,
      total: DEMO_TRADESMAN_QUOTES.length,
      totalPages: Math.max(1, Math.ceil(DEMO_TRADESMAN_QUOTES.length / limit)),
    },
  }
}
