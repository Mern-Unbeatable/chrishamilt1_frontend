import ComingSoon from '@/components/common/ComingSoon/ComingSoon'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'

export default function DashboardComingSoonPage({ title, description }) {
  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title={title}
        description={
          description ||
          'This dashboard page is not built yet. It will be replaced with the real screen during development.'
        }
      />
      <ComingSoon
        description="We're putting the finishing touches on this section."
        showTitle={false}
      />
    </div>
  )
}
