import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  DEMO_TRADESMAN_DASHBOARD_PROFILE,
  DEMO_TRADESMAN_DASHBOARD_STATS,
  DEMO_TRADESMAN_JOBS_COMPLETED,
  DEMO_TRADESMAN_MONTHLY_EARNINGS,
} from '@/data/tradesmanDashboardData'

export function isTradesmanDashboardApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

function formatStatNumber(value) {
  return Number(value ?? 0).toLocaleString('en-GB')
}

function formatCurrency(value) {
  const amount = Number(value ?? 0)
  return `£${amount.toLocaleString('en-GB')}`
}

function formatChartMonth(value) {
  if (!value) return ''

  const date = new Date(`${value}-01`)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-GB', { month: 'short' })
}

function formatRating(value) {
  const rating = Number(value ?? 0)
  if (!Number.isFinite(rating)) return '0'
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1)
}

function computeEarningsChange(monthlyEarnings = []) {
  if (monthlyEarnings.length < 2) return null

  const last = monthlyEarnings[monthlyEarnings.length - 1]?.amount ?? 0
  const previous = monthlyEarnings[monthlyEarnings.length - 2]?.amount ?? 0

  if (last === 0 && previous === 0) return null
  if (previous === 0) return '+100% MoM'

  const change = Math.round(((last - previous) / previous) * 100)
  return `${change >= 0 ? '+' : ''}${change}% MoM`
}

export function mapApiTradesmanDashboard(data = {}, sessionName = '') {
  const charts = data.charts ?? {}
  const profile = data.profile ?? {}
  const monthlyEarningsRaw = charts.monthlyEarnings ?? []
  const jobsCompletedRaw = charts.jobsCompleted ?? []

  const businessName = profile.businessName?.trim() || 'your business'
  const greetingName =
    sessionName?.trim()?.split(' ')[0] ||
    businessName.split(' ')[0] ||
    'there'

  const stats = [
    {
      id: 'tokens',
      label: 'Available tokens',
      value: formatStatNumber(data.tokens),
      iconKey: 'coins',
      iconTone: 'blue',
    },
    {
      id: 'pending-quotes',
      label: 'Pending quotes',
      value: formatStatNumber(data.pendingQuotes),
      iconKey: 'file',
      iconTone: 'orange',
    },
    {
      id: 'accepted-quotes',
      label: 'Accepted quotes',
      value: formatStatNumber(data.acceptedQuotes),
      iconKey: 'check',
      iconTone: 'green',
    },
    {
      id: 'active-jobs',
      label: 'Active jobs',
      value: formatStatNumber(data.activeJobs),
      iconKey: 'building',
      iconTone: 'blue',
    },
    {
      id: 'completed-jobs',
      label: 'Completed jobs',
      value: formatStatNumber(data.completedJobs),
      iconKey: 'checkCircle',
      iconTone: 'green',
    },
    {
      id: 'monthly-earnings',
      label: 'Monthly earnings',
      value: formatCurrency(data.monthlyEarnings),
      iconKey: 'wallet',
      iconTone: 'blue',
    },
    {
      id: 'total-earnings',
      label: 'Total earnings',
      value: formatCurrency(data.totalEarnings),
      iconKey: 'trend',
      iconTone: 'green',
    },
    {
      id: 'rating',
      label: 'Average rating',
      value: formatRating(data.averageRating ?? profile.averageRating),
      iconKey: 'star',
      iconTone: 'orange',
    },
    {
      id: 'messages',
      label: 'Unread messages',
      value: formatStatNumber(data.unreadMessages),
      iconKey: 'message',
      iconTone: 'red',
    },
  ]

  const monthlyEarnings = monthlyEarningsRaw.map((item) => ({
    month: formatChartMonth(item.month),
    earnings: item.amount ?? 0,
  }))

  const jobsCompleted = jobsCompletedRaw.map((item) => ({
    month: formatChartMonth(item.month),
    jobs: item.count ?? 0,
  }))

  return {
    profile: {
      greetingName,
      businessName,
      earningsChange: computeEarningsChange(monthlyEarningsRaw),
    },
    stats,
    monthlyEarnings,
    jobsCompleted,
  }
}

export function getDemoTradesmanDashboard() {
  return {
    profile: { ...DEMO_TRADESMAN_DASHBOARD_PROFILE },
    stats: DEMO_TRADESMAN_DASHBOARD_STATS,
    monthlyEarnings: DEMO_TRADESMAN_MONTHLY_EARNINGS,
    jobsCompleted: DEMO_TRADESMAN_JOBS_COMPLETED,
  }
}

export async function fetchTradesmanDashboard(sessionName = '') {
  const payload = await apiRequest('/api/tradesman/dashboard', {
    token: getAccessToken(),
  })

  const data = payload?.data ?? payload
  return mapApiTradesmanDashboard(data, sessionName)
}
