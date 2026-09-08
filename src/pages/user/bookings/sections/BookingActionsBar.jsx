import { Check, MessageCircle, Star, XCircle } from 'lucide-react'
import { canCancelBooking } from '@/data/myBookingsData'

export default function BookingActionsBar({
  booking,
  reviewSubmitted = false,
  onCancel,
  onLeaveReview,
  onMessage,
  cancelling = false,
}) {
  const isCompleted = String(booking?.status ?? '').toLowerCase() === 'completed'
  const canCancel = canCancelBooking(booking?.status) && onCancel
  const showReviewAction = isCompleted && onLeaveReview
  const alreadyReviewed = showReviewAction && reviewSubmitted

  if (!canCancel && !showReviewAction && !onMessage) return null

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-[#111827]">Booking actions</h2>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {onMessage ? (
          <button
            type="button"
            onClick={onMessage}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-btn-primary bg-white px-5 text-sm font-semibold text-btn-primary transition-colors hover:bg-[#EFF6FF]"
          >
            <MessageCircle className="size-4" />
            Message tradesman
          </button>
        ) : null}

        {showReviewAction ? (
          <div className="flex flex-col gap-1">
            <button
              type="button"
              disabled={alreadyReviewed}
              onClick={alreadyReviewed ? undefined : onLeaveReview}
              title={alreadyReviewed ? 'You have already reviewed this job' : undefined}
              className={
                alreadyReviewed
                  ? 'inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-[#D1FAE5] bg-[#ECFDF5] px-5 text-sm font-semibold text-[#059669] opacity-90'
                  : 'inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FFF7ED] px-5 text-sm font-semibold text-[#EA580C] transition-colors hover:bg-[#FFEDD5]'
              }
            >
              {alreadyReviewed ? (
                <>
                  <Check className="size-4" />
                  Already reviewed
                </>
              ) : (
                <>
                  <Star className="size-4" />
                  Leave a review
                </>
              )}
            </button>
          </div>
        ) : null}

        {canCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={cancelling}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-5 text-sm font-semibold text-[#B91C1C] transition-colors hover:bg-[#FEE2E2] disabled:opacity-60"
          >
            <XCircle className="size-4" />
            {cancelling ? 'Cancelling…' : 'Cancel booking'}
          </button>
        ) : null}
      </div>
    </section>
  )
}
