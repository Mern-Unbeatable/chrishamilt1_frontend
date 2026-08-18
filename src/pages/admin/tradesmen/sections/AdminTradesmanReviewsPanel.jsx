import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { RatingStars } from '@/pages/tradesman/reviews/sections/TradesmanReviewCard'

function AdminReviewCard({ name, initials, rating, date, text }) {
  return (
    <article className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#EAF2FE] text-sm font-bold text-btn-primary sm:size-12">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-[#111827]">{name}</h3>
              <div className="mt-1">
                <RatingStars rating={rating} size="sm" />
              </div>
            </div>
            <time className="shrink-0 text-xs font-medium text-[#94A3B8] sm:text-sm">{date}</time>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#111827]">{text}</p>
        </div>
      </div>
    </article>
  )
}

function DistributionTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm">
      <p className="text-xs font-medium text-[#64748B]">{label} stars</p>
      <p className="mt-0.5 text-sm font-semibold text-[#111827]">
        {payload[0].value} reviews
      </p>
    </div>
  )
}

export default function AdminTradesmanReviewsPanel({ reviews }) {
  const chartData = [...reviews.distribution].reverse()

  return (
    <div className="space-y-3">
      <section className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-5 text-center sm:px-5">
        <p className="text-[3rem] font-bold leading-none tracking-tight text-[#111827] sm:text-[3.25rem]">
          {reviews.averageRating.toFixed(1)}
        </p>
        <div className="mt-3 flex justify-center">
          <RatingStars
            rating={Math.round(reviews.averageRating)}
            size="lg"
            className="[&_svg]:fill-[#FBBF24] [&_svg]:text-[#FBBF24]"
          />
        </div>
        <p className="mt-3 text-sm text-[#64748B]">
          Based on {reviews.totalReviews} reviews
        </p>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
        <h2 className="text-base font-semibold text-[#111827]">Rating distribution</h2>
        <div className="mt-3 h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="stars"
                axisLine={false}
                tickLine={false}
                width={28}
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <Tooltip content={<DistributionTooltip />} cursor={{ fill: '#F8FAFC' }} />
              <Bar dataKey="count" fill="#2563EB" radius={[0, 6, 6, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="space-y-3">
        {reviews.items.map((review) => (
          <AdminReviewCard
            key={review.id}
            name={review.name}
            initials={review.initials}
            rating={review.rating}
            date={review.date}
            text={review.text}
          />
        ))}
      </div>
    </div>
  )
}
