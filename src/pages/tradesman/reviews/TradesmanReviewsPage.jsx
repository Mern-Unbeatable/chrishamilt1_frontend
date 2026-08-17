import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import { DEMO_TRADESMAN_REVIEWS, DEMO_TRADESMAN_REVIEWS_SUMMARY } from '@/data/tradesmanReviewsData'
import TradesmanReviewCard from '@/pages/tradesman/reviews/sections/TradesmanReviewCard'
import TradesmanReviewsSummary from '@/pages/tradesman/reviews/sections/TradesmanReviewsSummary'

export default function TradesmanReviewsPage() {
  const { totalReviews } = DEMO_TRADESMAN_REVIEWS_SUMMARY

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Reviews"
        description={`${totalReviews} verified customer reviews`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start xl:grid-cols-[minmax(0,360px)_1fr]">
        <TradesmanReviewsSummary />

        <div className="space-y-4">
          {DEMO_TRADESMAN_REVIEWS.map((review) => (
            <TradesmanReviewCard key={review.id} {...review} />
          ))}
        </div>
      </div>
    </div>
  )
}
