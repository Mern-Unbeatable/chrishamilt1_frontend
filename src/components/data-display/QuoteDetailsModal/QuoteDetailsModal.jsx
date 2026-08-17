import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, MessageCircle, Star, X, XCircle } from 'lucide-react'
import { cn } from '@/helpers/cn'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'reviews', label: 'Reviews' },
]

function RatingStars({ rating, size = 'sm' }) {
  const fullStars = Math.floor(rating)

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            size === 'sm' ? 'size-3.5' : 'size-4',
            index < fullStars
              ? 'fill-[#FBBF24] text-[#FBBF24]'
              : 'fill-[#E5E7EB] text-[#E5E7EB]',
          )}
          strokeWidth={0}
        />
      ))}
    </div>
  )
}

function MetricBox({ label, value }) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--secondary-text)] sm:text-xs">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--primary-text)]">{value}</p>
    </div>
  )
}

function OverviewTab({ quote }) {
  const distanceShort = quote.distance?.replace(' miles', ' mi').replace(' mile', ' mi')

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricBox label="Duration" value={quote.duration} />
        <MetricBox label="Start date" value={quote.startDate} />
        <MetricBox label="Distance" value={distanceShort ?? quote.distance} />
        <MetricBox label="Response" value={quote.responseTime} />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)]">
            Materials included?
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#DC2626]">
            {!quote.materialsIncluded ? <XCircle className="size-4 shrink-0" /> : null}
            {quote.materialsLabel ?? (quote.materialsIncluded ? 'Included' : 'Not Included')}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)]">
            Warranty / guarantee
          </p>
          <span className="text-sm font-semibold text-[#DC2626]">
            {quote.warrantyDays ?? 0} days
          </span>
        </div>
      </div>

      {quote.specialties?.length ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)]">
            Specialties
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {quote.specialties.map((specialty) => (
              <span
                key={specialty}
                className="inline-flex rounded-full border border-btn-primary px-3 py-1 text-xs font-semibold text-btn-primary"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ProposalTab({ quote }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--secondary-text)] sm:text-xs">
          Full proposal
        </p>
        <div className="mt-3 rounded-xl bg-[#F8FAFC] p-4 sm:p-5">
          <p className="text-sm leading-7 text-[var(--primary-text)]">{quote.fullProposal}</p>
        </div>
      </div>

      <div
        aria-hidden
        className="aspect-[16/9] w-full rounded-xl border border-[#E5E7EB] bg-[#EEF2F6]"
      />
    </div>
  )
}

function ReviewsTab({ reviews = [] }) {
  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="rounded-xl bg-[#F1F5F9] p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[var(--primary-text)]">{review.name}</p>
            <p className="text-xs text-[var(--secondary-text)]">{review.date}</p>
          </div>
          <div className="mt-2">
            <RatingStars rating={review.rating} />
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--primary-text)]">{review.text}</p>
        </article>
      ))}
    </div>
  )
}

export default function QuoteDetailsModal({
  open,
  onClose,
  quote,
  onHireTradesman,
  onMessage,
  hireTradesmanLabel = 'Hire Tradesman',
  messageLabel = 'Message',
}) {
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!open) {
      setActiveTab('overview')
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open || !quote) return null

  const { tradesman } = quote
  const {
    name,
    initials,
    avatar,
    rating,
    reviewCount,
    jobsCompleted,
    yearsExperience,
  } = tradesman || {}

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close quote details"
        className="absolute inset-0 bg-[#111827]/50"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-details-title"
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-2xl"
      >
        <div className="border-b border-[#E5E7EB] px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0891B2] text-sm font-bold text-white sm:size-14 sm:text-base">
                {avatar ? (
                  <img src={avatar} alt="" className="size-full object-cover" />
                ) : (
                  initials
                )}
              </div>

              <div className="min-w-0">
                <h2 id="quote-details-title" className="text-base font-semibold text-[var(--primary-text)] sm:text-lg">
                  {name}
                </h2>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--secondary-text)] sm:text-sm">
                  <RatingStars rating={rating} />
                  <span className="font-medium text-[var(--primary-text)]">{rating}</span>
                  <span>({reviewCount} reviews)</span>
                  <span aria-hidden>·</span>
                  <span>{jobsCompleted} jobs</span>
                  <span aria-hidden>·</span>
                  <span>{yearsExperience} yrs exp.</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-start gap-1 sm:gap-2">
              <div className="text-right">
                <p className="text-xl font-bold text-btn-primary sm:text-2xl">{quote.amount}</p>
                <p className="mt-0.5 text-[10px] text-[var(--secondary-text)] sm:text-xs">Total Quote</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[var(--primary-text)]"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex gap-6 border-b border-[#E5E7EB]">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  '-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors',
                  activeTab === tab.id
                    ? 'border-btn-primary text-btn-primary'
                    : 'border-transparent text-[var(--secondary-text)] hover:text-[var(--primary-text)]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {activeTab === 'overview' ? <OverviewTab quote={quote} /> : null}
          {activeTab === 'proposal' ? <ProposalTab quote={quote} /> : null}
          {activeTab === 'reviews' ? <ReviewsTab reviews={quote.reviews} /> : null}
        </div>

        <div className="border-t border-[#E5E7EB] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            {onMessage ? (
              <button
                type="button"
                onClick={onMessage}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-btn-primary bg-white text-sm font-semibold text-btn-primary transition-colors hover:bg-[#EFF6FF]"
              >
                <MessageCircle className="size-4 shrink-0" strokeWidth={1.75} />
                {messageLabel}
              </button>
            ) : null}

            {onHireTradesman ? (
              <button
                type="button"
                onClick={onHireTradesman}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-btn-primary text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
              >
                <Check className="size-4 shrink-0" strokeWidth={2.25} />
                {hireTradesmanLabel}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
