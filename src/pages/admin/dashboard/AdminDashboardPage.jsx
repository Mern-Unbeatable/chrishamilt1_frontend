import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import AdminGrowthChart from '@/pages/admin/dashboard/sections/AdminGrowthChart'
import AdminJobsCompletedChart from '@/pages/admin/dashboard/sections/AdminJobsCompletedChart'
import AdminMonthlyEarningsChart from '@/pages/admin/dashboard/sections/AdminMonthlyEarningsChart'
import AdminStatsGrid from '@/pages/admin/dashboard/sections/AdminStatsGrid'
import AdminTopTokenBuyers from '@/pages/admin/dashboard/sections/AdminTopTokenBuyers'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Dashboard"
        description="Platform overview and key performance metrics."
      />

      <AdminStatsGrid />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminMonthlyEarningsChart />
        </div>
        <AdminJobsCompletedChart />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminGrowthChart />
        </div>
        <AdminTopTokenBuyers />
      </div>
    </div>
  )
}
