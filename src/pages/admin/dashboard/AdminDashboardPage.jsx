import { useEffect, useState } from 'react'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import AdminGrowthChart from '@/pages/admin/dashboard/sections/AdminGrowthChart'
import AdminJobsCompletedChart from '@/pages/admin/dashboard/sections/AdminJobsCompletedChart'
import AdminMonthlyEarningsChart from '@/pages/admin/dashboard/sections/AdminMonthlyEarningsChart'
import AdminStatsGrid from '@/pages/admin/dashboard/sections/AdminStatsGrid'
import AdminTopTokenBuyers from '@/pages/admin/dashboard/sections/AdminTopTokenBuyers'
import {
  fetchAdminDashboard,
  getDemoAdminDashboard,
  isAdminDashboardApiEnabled,
} from '@/services/adminDashboardApi'

export default function AdminDashboardPage() {
  const useApi = isAdminDashboardApiEnabled()
  const [dashboard, setDashboard] = useState(() => getDemoAdminDashboard())
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!useApi) {
      setDashboard(getDemoAdminDashboard())
      setLoading(false)
      setError('')
      return undefined
    }

    let cancelled = false

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchAdminDashboard()
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
  }, [useApi])

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Dashboard"
          description="Platform overview and key performance metrics."
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
          description="Platform overview and key performance metrics."
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
        title="Dashboard"
        description="Platform overview and key performance metrics."
      />

      <AdminStatsGrid stats={dashboard.stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminMonthlyEarningsChart data={dashboard.monthlyEarnings} />
        </div>
        <AdminJobsCompletedChart data={dashboard.jobsCompleted} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminGrowthChart data={dashboard.growth} />
        </div>
        <AdminTopTokenBuyers buyers={dashboard.topTokenBuyers} />
      </div>
    </div>
  )
}
