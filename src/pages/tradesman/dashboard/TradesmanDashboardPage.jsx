import { Link } from 'react-router'
import { Coins, Search } from 'lucide-react'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import { DEMO_TRADESMAN_DASHBOARD_PROFILE } from '@/data/tradesmanDashboardData'
import TradesmanEarningsChart from '@/pages/tradesman/dashboard/sections/TradesmanEarningsChart'
import TradesmanJobsCompletedChart from '@/pages/tradesman/dashboard/sections/TradesmanJobsCompletedChart'
import TradesmanStatsGrid from '@/pages/tradesman/dashboard/sections/TradesmanStatsGrid'

export default function TradesmanDashboardPage() {
  const { greetingName, businessName } = DEMO_TRADESMAN_DASHBOARD_PROFILE

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

      <TradesmanStatsGrid />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TradesmanEarningsChart />
        </div>
        <TradesmanJobsCompletedChart />
      </div>
    </div>
  )
}
