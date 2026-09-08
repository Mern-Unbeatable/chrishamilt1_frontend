import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Star, X } from 'lucide-react'
import { cn } from '@/helpers/cn'

export default function LeaveReviewModal({
  open,
  tradesmanName = 'your tradesman',
  onClose,
  onSubmit,
  submitting = false,
}) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    if (!open) return undefined

    setRating(5)
    setComment('')
    setHoverRating(0)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  const displayRating = hoverRating || rating

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <div
        className="w-full max-w-lg rounded-2xl border border-[#E5E7EB] bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-review-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4 sm:px-6">
          <div>
            <h2 id="leave-review-title" className="text-lg font-semibold text-[#111827]">
              Leave a review
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Share your experience with {tradesmanName}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F8FAFC]"
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          className="space-y-5 px-5 py-5 sm:px-6"
          onSubmit={async (event) => {
            event.preventDefault()
            await onSubmit?.({ rating, comment })
          }}
        >
          <div>
            <p className="text-sm font-medium text-[#111827]">Your rating</p>
            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1
                const active = value <= displayRating

                return (
                  <button
                    key={value}
                    type="button"
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(value)}
                    className="rounded p-0.5 transition-transform hover:scale-105"
                    aria-label={`Rate ${value} star${value === 1 ? '' : 's'}`}
                  >
                    <Star
                      className={cn(
                        'size-8',
                        active
                          ? 'fill-[#FBBF24] text-[#FBBF24]'
                          : 'fill-[#E5E7EB] text-[#E5E7EB]',
                      )}
                      strokeWidth={0}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label htmlFor="review-comment" className="text-sm font-medium text-[#111827]">
              Your review
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              required
              minLength={10}
              placeholder="Tell others about the quality of work, communication, and timeliness…"
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#111827] outline-none transition-colors focus:border-btn-primary"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-[#E5E7EB] px-5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || comment.trim().length < 10}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-btn-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit review'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
