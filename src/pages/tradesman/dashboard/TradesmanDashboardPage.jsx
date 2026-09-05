import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Coins, Search } from 'lucide-react'
import { useAuth } from '@/auth/AuthProvider'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import TradesmanEarningsChart from '@/pages/tradesman/dashboard/sections/TradesmanEarningsChart'
import TradesmanJobsCompletedChart from '@/pages/tradesman/dashboard/sections/TradesmanJobsCompletedChart'
import TradesmanStatsGrid from '@/pages/tradesman/dashboard/sections/TradesmanStatsGrid'
import {
  fetchTradesmanDashboard,
  getDemoTradesmanDashboard,
  isTradesmanDashboardApiEnabled,
} from '@/services/tradesmanDashboardApi'

export default function TradesmanDashboardPage() {
  const { session } = useAuth()
  const useApi = isTradesmanDashboardApiEnabled()
  const [dashboard, setDashboard] = useState(() => getDemoTradesmanDashboard())
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!useApi) {
      setDashboard(getDemoTradesmanDashboard())
      setLoading(false)
      setError('')
      return undefined
    }

    let cancelled = false

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchTradesmanDashboard(session?.name)
        if (!cancelled) setDashboard(data)
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Unable to load dashboard.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [useApi, session?.name])

  const { greetingName, businessName } = dashboard.profile

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Dashboard"
          description="Loading your performance overview…"
        />
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
          <p className="text-sm text-[#64748B]">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Dashboard"
          description="Your performance overview."
        />
        <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-12 text-center">
          <p className="text-base font-semibold text-[#B91C1C]">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={`Good morning, ${greetingName}`}
        description={`Here's how ${businessName} is performing this month.`}
        actions={
          <>
            <Link
              to="/tradesman/wallet"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#F8FAFC]"
            >
              <Coins className="size-4 shrink-0" strokeWidth={1.75} />
              Buy tokens
            </Link>
            <Link
              to="/tradesman/browse-jobs"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-btn-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
            >
              <Search className="size-4 shrink-0" strokeWidth={1.75} />
              Browse jobs
            </Link>
          </>
        }
      />

      <TradesmanStatsGrid stats={dashboard.stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TradesmanEarningsChart
            data={dashboard.monthlyEarnings}
            earningsChange={dashboard.profile.earningsChange}
          />
        </div>
        <TradesmanJobsCompletedChart data={dashboard.jobsCompleted} />
      </div>
    </div>
  )
}
