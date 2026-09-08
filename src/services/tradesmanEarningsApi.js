import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  DEMO_TRADESMAN_EARNINGS_SUMMARY,
  DEMO_TRADESMAN_REVENUE_CHART,
  DEMO_TRADESMAN_REVENUE_SUMMARY,
} from '@/data/tradesmanEarningsData'

function formatCurrency(value) {
  const amount = Number(value ?? 0)
  return `£${amount.toLocaleString('en-GB')}`
}

function formatChangePercent(value) {
  const change = Number(value ?? 0)
  if (!Number.isFinite(change) || change === 0) return ''

  const sign = change > 0 ? '+' : ''
  return `${sign}${change}%`
}

function changeSubtextClassName(value) {
  const change = Number(value ?? 0)
  if (change > 0) return 'text-[#059669] font-semibold'
  if (change < 0) return 'text-[#DC2626] font-semibold'
  return ''
}

export function isTradesmanEarningsApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

export function mapApiEarningsToPage(data = {}) {
  const summary = data.summary ?? {}
  const revenue = data.revenue ?? {}
  const monthlyRevenue = data.charts?.monthlyRevenue ?? []

  return {
    payoutNote:
      data.payoutNote ?? 'Payouts land 2 working days after customer approval.',
    summaryStats: [
      {
        id: 'today',
        label: 'Today',
        value: formatCurrency(summary.today),
        iconKey: 'wallet',
        iconTone: 'blue',
      },
      {
        id: 'week',
        label: 'This week',
        value: formatCurrency(summary.thisWeek),
        subtext: formatChangePercent(summary.thisWeekChangePercent),
        subtextClassName: changeSubtextClassName(summary.thisWeekChangePercent),
        iconKey: 'trend',
        iconTone: 'blue',
      },
      {
        id: 'month',
        label: 'This month',
        value: formatCurrency(summary.thisMonth),
        subtext: formatChangePercent(summary.thisMonthChangePercent),
        subtextClassName: changeSubtextClassName(summary.thisMonthChangePercent),
        iconKey: 'coins',
        iconTone: 'green',
      },
      {
        id: 'lifetime',
        label: 'Lifetime',
        value: formatCurrency(summary.lifetime),
        iconKey: 'pound',
        iconTone: 'yellow',
      },
    ],
    revenueSummary: {
      averageJobValue: formatCurrency(revenue.averageJobValue),
      completedJobs: Number(revenue.completedJobs ?? 0),
    },
    chartData: monthlyRevenue.map((item) => ({
      month: item.label ?? item.month ?? '',
      revenue: Number(item.amount ?? 0),
    })),
    recentItems: (data.recent?.items ?? []).map((item) => ({
      id: item.id,
      jobCode: item.jobCode ?? '—',
      jobTitle: item.jobTitle ?? 'Completed job',
      amount: formatCurrency(item.amount),
      date: formatRecentDate(item.createdAt),
    })),
    recent: data.recent ?? { items: [], total: 0, page: 1, limit: 10 },
  }
}

function formatRecentDate(value) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export async function fetchTradesmanEarnings() {
  const payload = await apiRequest('/api/tradesman/earnings', {
    token: getAccessToken(),
  })

  const data = payload?.data ?? payload
  if (!data || typeof data !== 'object') {
    throw new Error('Unable to load earnings.')
  }

  return mapApiEarningsToPage(data)
}

export function getDemoTradesmanEarningsPage() {
  return {
    payoutNote: 'Payouts land 2 working days after customer approval.',
    summaryStats: DEMO_TRADESMAN_EARNINGS_SUMMARY,
    revenueSummary: DEMO_TRADESMAN_REVENUE_SUMMARY,
    chartData: DEMO_TRADESMAN_REVENUE_CHART,
    recentItems: [
      {
        id: 'earn-1',
        jobCode: 'Job-014',
        jobTitle: 'Bathroom renovation',
        amount: '£1,250',
        date: '2 Sep 2026',
      },
      {
        id: 'earn-2',
        jobCode: 'Job-011',
        jobTitle: 'Consumer unit upgrade',
        amount: '£890',
        date: '28 Aug 2026',
      },
    ],
    recent: { items: [], total: 0, page: 1, limit: 10 },
  }
}
