import { useEffect, useMemo, useState } from 'react'
import Pagination from '@/components/common/Pagination/Pagination'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import TradesmanReviewCard from '@/pages/tradesman/reviews/sections/TradesmanReviewCard'
import TradesmanReviewsSummary from '@/pages/tradesman/reviews/sections/TradesmanReviewsSummary'
import {
  fetchTradesmanReviews,
  getDemoTradesmanReviewsPage,
  isTradesmanReviewsApiEnabled,
  TRADESMAN_REVIEWS_PAGE_SIZE,
} from '@/services/tradesmanReviewsApi'

export default function TradesmanReviewsPage() {
  const useApi = isTradesmanReviewsApiEnabled()
  const demoData = useMemo(() => getDemoTradesmanReviewsPage(), [])

  const [summary, setSummary] = useState(demoData.summary)
  const [reviews, setReviews] = useState(demoData.reviews)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!useApi) {
      setSummary(demoData.summary)
      setReviews(demoData.reviews)
      setTotalPages(1)
      setLoading(false)
      setError('')
      return undefined
    }

    let cancelled = false

    async function loadReviews() {
      setLoading(true)
      setError('')

      try {
        const result = await fetchTradesmanReviews({
          page,
          limit: TRADESMAN_REVIEWS_PAGE_SIZE,
        })

        if (cancelled) return

        setSummary(result.summary)
        setReviews(result.reviews)
        setTotalPages(result.pagination.totalPages)
      } catch (err) {
        if (cancelled) return

        setSummary({ averageRating: 0, totalReviews: 0, distribution: [] })
        setReviews([])
        setTotalPages(1)
        setError(err?.message || 'Unable to load reviews right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadReviews()

    return () => {
      cancelled = true
    }
  }, [demoData.reviews, demoData.summary, page, useApi])

  const { totalReviews } = summary

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Reviews"
        description={
          loading
            ? 'Loading reviews…'
            : `${totalReviews} verified customer review${totalReviews === 1 ? '' : 's'}`
        }
      />

      {error ? (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-4">
          <p className="text-sm font-semibold text-[#B91C1C]">{error}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
          <p className="text-sm text-[#64748B]">Loading reviews…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start xl:grid-cols-[minmax(0,360px)_1fr]">
          <TradesmanReviewsSummary summary={summary} />

          <div className="space-y-4">
            {reviews.length ? (
              reviews.map((review) => <TradesmanReviewCard key={review.id} {...review} />)
            ) : (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-12 text-center">
                <p className="text-sm text-[#64748B]">No reviews yet.</p>
              </div>
            )}

            {totalPages > 1 ? (
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
