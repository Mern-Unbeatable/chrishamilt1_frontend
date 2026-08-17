import { Star } from 'lucide-react'
import { RatingStars } from '@/pages/tradesman/reviews/sections/TradesmanReviewCard'
import {
  DEMO_TRADESMAN_RATING_DISTRIBUTION,
  DEMO_TRADESMAN_REVIEWS_SUMMARY,
} from '@/data/tradesmanReviewsData'

function DistributionRow({ stars, count, maxCount }) {
  const width = maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%'

  return (
    <div className="grid grid-cols-[36px_1fr_32px] items-center gap-3">
      <span className="inline-flex items-center gap-0.5 text-sm font-medium text-[#111827]">
        {stars}
        <Star className="size-3.5 fill-[#111827] text-[#111827]" strokeWidth={0} />
      </span>

      <div className="h-2 overflow-hidden rounded-full bg-[#F1F5F9]">
        <div
          className="h-full rounded-full bg-[#F97316]"
          style={{ width }}
        />
      </div>

      <span className="text-right text-sm text-[#64748B]">{count}</span>
    </div>
  )
}

export default function TradesmanReviewsSummary() {
  const { averageRating, totalReviews } = DEMO_TRADESMAN_REVIEWS_SUMMARY
  const maxCount = Math.max(...DEMO_TRADESMAN_RATING_DISTRIBUTION.map((item) => item.count))

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-8 text-center sm:px-6 sm:py-10">
        <p className="text-[3.25rem] font-bold leading-none tracking-tight text-[#111827] sm:text-[3.5rem]">
          {averageRating.toFixed(1)}
        </p>
        <div className="mt-4 flex justify-center">
          <RatingStars
            rating={5}
            size="lg"
            className="[&_svg]:fill-[#F97316] [&_svg]:text-[#F97316]"
          />
        </div>
        <p className="mt-4 text-sm text-[#64748B]">Based on {totalReviews} reviews</p>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[#111827]">Rating distribution</h2>

        <div className="mt-5 space-y-3.5">
          {DEMO_TRADESMAN_RATING_DISTRIBUTION.map((item) => (
            <DistributionRow
              key={item.stars}
              stars={item.stars}
              count={item.count}
              maxCount={maxCount}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
