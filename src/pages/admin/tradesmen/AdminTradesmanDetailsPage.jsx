import { useParams } from 'react-router'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import { getAdminTradesmanDetail } from '@/data/adminTradesmanDetailData'
import AdminTradesmanCompletedJobsCard from '@/pages/admin/tradesmen/sections/AdminTradesmanCompletedJobsCard'
import AdminTradesmanPerformanceCard from '@/pages/admin/tradesmen/sections/AdminTradesmanPerformanceCard'
import AdminTradesmanProfileHeader, {
  AdminTradesmanBackLink,
} from '@/pages/admin/tradesmen/sections/AdminTradesmanProfileHeader'
import AdminTradesmanReviewsPanel from '@/pages/admin/tradesmen/sections/AdminTradesmanReviewsPanel'
import AdminTradesmanTokenCard from '@/pages/admin/tradesmen/sections/AdminTradesmanTokenCard'

export default function AdminTradesmanDetailsPage() {
  const { tradesmanId } = useParams()
  const tradesman = getAdminTradesmanDetail(tradesmanId)

  if (!tradesman) {
    return (
      <div className="space-y-6">
        <AdminTradesmanBackLink />
        <p className="text-sm text-[#64748B]">Tradesman not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Tradesmen"
        description="Monitor every tradesman on the platform — their token balance, quote activity, and account standing."
      />

      <div className="space-y-3">
        <AdminTradesmanBackLink />

        <AdminTradesmanProfileHeader
          tradesman={tradesman}
          onSuspend={() => {}}
          onDelete={() => {}}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:items-start">
        <div className="space-y-4">
          <AdminTradesmanPerformanceCard
            stats={tradesman.stats}
            memberSince={tradesman.memberSince}
          />
          <AdminTradesmanTokenCard tokens={tradesman.tokens} />
          <AdminTradesmanCompletedJobsCard completedJobs={tradesman.completedJobs} />
        </div>

        <AdminTradesmanReviewsPanel reviews={tradesman.reviews} />
      </div>
    </div>
  )
}
