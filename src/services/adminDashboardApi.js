import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  DEMO_ADMIN_DASHBOARD_STATS,
  DEMO_ADMIN_GROWTH,
  DEMO_ADMIN_JOBS_COMPLETED,
  DEMO_ADMIN_MONTHLY_EARNINGS,
  DEMO_ADMIN_TOP_TOKEN_BUYERS,
} from '@/data/adminDashboardData'

export function isAdminDashboardApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

function formatStatNumber(value) {
  return Number(value ?? 0).toLocaleString('en-GB')
}

function formatCurrency(value) {
  const amount = Number(value ?? 0)
  return `£${amount.toLocaleString('en-GB')}`
}

export function mapApiAdminDashboard(data = {}) {
  const cards = data.cards ?? {}
  const charts = data.charts ?? {}

  const stats = [
    {
      id: 'customers',
      label: 'Total Customers',
      value: formatStatNumber(cards.totalCustomers),
      iconKey: 'users',
      iconTone: 'blue',
    },
    {
      id: 'tradesmen',
      label: 'Total Tradesmen',
      value: formatStatNumber(cards.totalTradesmen),
      iconKey: 'briefcase',
      iconTone: 'purple',
    },
    {
      id: 'active-tradesmen',
      label: 'Active Tradesmen',
      value: formatStatNumber(cards.activeTradesmen),
      iconKey: 'userCheck',
      iconTone: 'green',
    },
    {
      id: 'low-token',
      label: 'Low Token Accounts',
      value: formatStatNumber(cards.lowTokenAccounts),
      iconKey: 'alert',
      iconTone: 'orange',
    },
    {
      id: 'jobs-posted',
      label: 'Jobs Posted',
      value: formatStatNumber(cards.jobsPosted),
      iconKey: 'clipboard',
      iconTone: 'blue',
    },
    {
      id: 'open-jobs',
      label: 'Open Jobs',
      value: formatStatNumber(cards.openJobs),
      iconKey: 'folder',
      iconTone: 'orange',
    },
    {
      id: 'completed-jobs',
      label: 'Completed Jobs',
      value: formatStatNumber(cards.completedJobs),
      iconKey: 'check',
      iconTone: 'green',
    },
    {
      id: 'quotes-today',
      label: 'Quotes Today',
      value: formatStatNumber(cards.quotesToday),
      iconKey: 'file',
      iconTone: 'purple',
    },
    {
      id: 'token-sales',
      label: 'Token Sales Today',
      value: formatCurrency(cards.tokenSalesToday),
      iconKey: 'pound',
      iconTone: 'green',
    },
    {
      id: 'monthly-revenue',
      label: 'Monthly Revenue',
      value: formatCurrency(cards.monthlyRevenue),
      iconKey: 'trend',
      iconTone: 'blue',
    },
    {
      id: 'tokens-sold',
      label: 'Total Tokens Sold',
      value: formatStatNumber(cards.totalTokensSold),
      iconKey: 'coins',
      iconTone: 'purple',
    },
    {
      id: 'tokens-used',
      label: 'Tokens Used',
      value: formatStatNumber(cards.tokensUsed),
      iconKey: 'coinsUsed',
      iconTone: 'yellow',
    },
  ]

  const monthlyEarnings = (charts.monthlyEarnings ?? []).map((item) => ({
    month: item.label,
    earnings: item.amount ?? 0,
  }))

  const jobsCompleted = (charts.jobsCompleted ?? []).map((item) => ({
    month: item.label,
    jobs: item.count ?? 0,
  }))

  const growth = (charts.growth ?? []).map((item) => ({
    month: item.label,
    customers: item.customers ?? 0,
    tradesmen: item.tradesmen ?? 0,
  }))

  const topBuyersRaw = data.topTokenBuyers ?? []
  const maxAmount = Math.max(...topBuyersRaw.map((buyer) => buyer.amount ?? 0), 1)

  const topTokenBuyers = topBuyersRaw.map((buyer) => ({
    id: buyer.tradesmanId ?? buyer.rank,
    name: buyer.name ?? 'Unknown',
    amount: formatCurrency(buyer.amount),
    tokens: buyer.tokens ?? 0,
    volume: Math.round(((buyer.amount ?? 0) / maxAmount) * 100),
  }))

  return {
    stats,
    monthlyEarnings,
    jobsCompleted,
    growth,
    topTokenBuyers,
  }
}

export function getDemoAdminDashboard() {
  return {
    stats: DEMO_ADMIN_DASHBOARD_STATS,
    monthlyEarnings: DEMO_ADMIN_MONTHLY_EARNINGS,
    jobsCompleted: DEMO_ADMIN_JOBS_COMPLETED,
    growth: DEMO_ADMIN_GROWTH,
    topTokenBuyers: DEMO_ADMIN_TOP_TOKEN_BUYERS,
  }
}

export async function fetchAdminDashboard() {
  const payload = await apiRequest('/api/admin/dashboard', {
    token: getAccessToken(),
  })

  const data = payload?.data ?? payload
  return mapApiAdminDashboard(data)
}
