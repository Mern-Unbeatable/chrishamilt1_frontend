import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  ChevronRight,
  Clock,
  Coins,
  MapPin,
  Pencil,
  PoundSterling,
  Tag,
  Trash2,
} from 'lucide-react'
import BuyLeadModal from '@/components/data-display/BuyLeadModal'
import SendQuoteModal from '@/components/data-display/SendQuoteModal'
import StatusBadge from '@/components/data-display/DataTable/StatusBadge'
import { canCancelBooking } from '@/data/myBookingsData'
import { cn } from '@/helpers/cn'
import { getSession } from '@/auth/authService'
import { submitQuoteCreate } from '@/helpers/submitQuoteCreate'

const DEFAULT_JOB_IMAGE =
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80'

function CardImage({ image, alt = '' }) {
  return (
    <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-[#EEF2F6] sm:size-24">
      <img src={image || DEFAULT_JOB_IMAGE} alt={alt} className="size-full object-cover" />
    </div>
  )
}

/**
 * Shared list card for browse jobs, customer bookings, and posted jobs.
 * Pass variant and callbacks from the parent — component never navigates itself.
 */
export default function JobCard({
  id,
  variant = 'browse',
  title,
  image,
  location,
  price,
  priceRange,
  postedAt,
  date,
  time,
  category,
  status,
  tokenCost,
  leadPrice,
  onViewLead,
  viewLeadLabel = 'View Lead',
  onBuyThis,
  buyThisLabel = 'Buy This',
  onBuyWithToken,
  showBuyThis = true,
  onOpen,
  onCancel,
  cancelLabel = 'Cancel Booking',
  onViewQuote,
  viewQuoteLabel = 'View Quote',
  onEdit,
  onDelete,
  deleteAriaLabel = 'Delete job',
  className = '',
}) {
  const navigate = useNavigate()
  const [buyModalOpen, setBuyModalOpen] = useState(false)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [quotedLocally, setQuotedLocally] = useState(false)

  const session = getSession()
  const role = session?.role?.toLowerCase()
  const isTradesman = role === 'tradesman'
  const isGuest = !role

  // "Buy This" is ONLY visible for Public (Guest) and Tradesman.
  // Customers (user) and Admins do not buy leads or quote.
  const canSeeBuyThis = isGuest || isTradesman
  const shouldShowBuyThis = showBuyThis && canSeeBuyThis

  const amount = price ?? priceRange
  const resolvedTokenCost = tokenCost ?? leadPrice ?? null
  const showCancel = variant === 'booking' && canCancelBooking(status) && onCancel

  const handleQuoteSubmit = async (formData) => {
    const result = await submitQuoteCreate(id, formData)
    if (result && !result.needsTokens) {
      setQuotedLocally(true)
      setQuoteModalOpen(false)
    }
    return result
  }

  if (variant === 'posted') {
    return (
      <article
        className={cn(
          'rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5',
          className,
        )}
      >
        <div className="flex items-start gap-4 sm:gap-5">
          <CardImage image={image} alt={title} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    title={title}
                    className="line-clamp-3 lg:line-clamp-1 text-base font-semibold text-[#111827] sm:text-lg"
                  >
                    {title}
                  </h3>
                  {status ? <StatusBadge status={status} /> : null}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#64748B]">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4 shrink-0" />
                    {location}
                  </span>
                  {amount ? (
                    <span className="inline-flex items-center gap-1.5">
                      <PoundSterling className="size-4 shrink-0" />
                      {amount}
                    </span>
                  ) : null}
                  {postedAt ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-4 shrink-0" />
                      {postedAt}
                    </span>
                  ) : null}
                </div>
              </div>

              {category ? (
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 text-xs font-medium text-[#475569]">
                    <Tag className="size-3 text-[#64748B]" />
                    {category}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-[#F1F5F9] pt-4">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              aria-label={deleteAriaLabel}
              className="inline-flex size-10 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#DC2626] transition-colors hover:bg-[#FEE2E2]"
            >
              <Trash2 className="size-4" strokeWidth={1.75} />
            </button>
          ) : null}

          {onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              aria-label="Edit job"
              className="inline-flex size-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-btn-primary transition-colors hover:bg-[#DCE9FD]"
            >
              <Pencil className="size-4" strokeWidth={1.75} />
            </button>
          ) : null}

          {onViewQuote ? (
            <button
              type="button"
              onClick={onViewQuote}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-btn-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] sm:min-w-33"
            >
              {viewQuoteLabel}
            </button>
          ) : null}
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-5',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <CardImage image={image} alt={title} />

        <div className="min-w-0 flex-1">
          {variant === 'browse' && category ? (
            <div className="mb-1.5">
              <span className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 text-xs font-medium text-[#475569]">
                <Tag className="size-3 text-[#64748B]" />
                {category}
              </span>
            </div>
          ) : null}

          <div className="min-w-0">
            {variant === 'booking' && onOpen ? (
              <button
                type="button"
                onClick={onOpen}
                title={title}
                className="line-clamp-3 lg:line-clamp-1 text-left text-base font-semibold text-(--primary-text) transition-colors hover:text-btn-primary sm:text-lg"
              >
                {title}
              </button>
            ) : variant === 'browse' && onViewLead ? (
              <button
                type="button"
                onClick={onViewLead}
                title={title}
                className="line-clamp-3 lg:line-clamp-1 text-left text-base font-semibold text-(--primary-text) transition-colors hover:text-btn-primary sm:text-lg"
              >
                {title}
              </button>
            ) : (
              <h3
                title={title}
                className="line-clamp-3 lg:line-clamp-1 text-base font-semibold text-(--primary-text) sm:text-lg"
              >
                {title}
              </h3>
            )}
          </div>

          {variant === 'booking' && date ? (
            <p className="mt-1 text-sm text-[#64748B]">
              {date} <span aria-hidden>•</span> {time}
            </p>
          ) : null}

          <div
            className={cn(
              'flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-(--secondary-text)',
              variant === 'booking' ? 'mt-2' : 'mt-3',
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" />
              {location}
            </span>

            {amount ? (
              <span className="inline-flex items-center gap-1.5">
                <PoundSterling className="size-4 shrink-0" />
                {amount}
              </span>
            ) : null}

            {postedAt ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4 shrink-0" />
                {postedAt}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {variant === 'browse' ? (
        <div className="flex w-full shrink-0 flex-wrap items-center justify-between gap-3 sm:w-auto sm:flex-nowrap sm:justify-end sm:gap-10 lg:gap-12">
          {/* Token Badge only for Public & Tradesman */}
          {canSeeBuyThis && resolvedTokenCost != null ? (
            <span
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs sm:text-sm font-bold text-amber-900 shadow-xs"
              title={`${resolvedTokenCost} Tokens to quote`}
            >
              <Coins className="size-4 text-amber-600" />
              {resolvedTokenCost} T
            </span>
          ) : null}

          {/* Action buttons: row on mobile, stacked column on desktop */}
          <div className="flex flex-row items-center gap-2 sm:flex-col sm:gap-2.5 w-auto sm:w-36">
            {onViewQuote ? (
              <button
                type="button"
                onClick={onViewQuote}
                className="rounded-lg border border-[#E5E7EB] bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#111827] transition-colors hover:bg-[#F8FAFC] text-center sm:w-full"
              >
                {viewQuoteLabel}
              </button>
            ) : null}

            {onViewLead ? (
              <button
                type="button"
                onClick={onViewLead}
                className="rounded-lg border border-[#CBD5E1] bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#1E293B] transition-colors hover:bg-[#F8FAFC] text-center sm:w-full"
              >
                {viewLeadLabel}
              </button>
            ) : null}

            {shouldShowBuyThis ? (
              <button
                type="button"
                disabled={quotedLocally}
                onClick={
                  quotedLocally
                    ? undefined
                    : onBuyThis || (() => setBuyModalOpen(true))
                }
                className={cn(
                  'rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-center sm:w-full shadow-xs transition-colors',
                  quotedLocally
                    ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 cursor-default'
                    : 'bg-btn-primary text-white hover:bg-[#0150CC]',
                )}
              >
                {quotedLocally ? '✓ Quoted' : buyThisLabel}
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="flex w-full shrink-0 items-center justify-between gap-3 sm:w-auto sm:justify-end">
          <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end sm:gap-2">
            {status ? <StatusBadge status={status} /> : null}

            {showCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-btn-primary px-3 text-xs font-semibold text-white transition-colors hover:bg-[#0150CC] sm:px-4 sm:text-sm"
              >
                {cancelLabel}
              </button>
            ) : null}
          </div>

          {onOpen ? (
            <button
              type="button"
              onClick={onOpen}
              aria-label={`Open ${title}`}
              className="inline-flex size-8 shrink-0 items-center justify-center text-[#CBD5E1] transition-colors hover:text-[#64748B]"
            >
              <ChevronRight className="size-5" strokeWidth={1.75} />
            </button>
          ) : (
            <ChevronRight className="size-5 shrink-0 text-[#CBD5E1]" strokeWidth={1.75} aria-hidden />
          )}
        </div>
      )}

      {variant === 'browse' ? (
        <>
          <BuyLeadModal
            open={buyModalOpen}
            onClose={() => setBuyModalOpen(false)}
            job={{
              id,
              title,
              location,
              priceRange: amount,
              category,
              tokenCost: resolvedTokenCost,
              leadPrice,
            }}
            onOpenQuote={() => {
              setBuyModalOpen(false)
              setQuoteModalOpen(true)
            }}
            onBuyWithToken={onBuyWithToken}
          />

          {quoteModalOpen ? (
            <SendQuoteModal
              open={quoteModalOpen}
              onClose={() => setQuoteModalOpen(false)}
              jobTitle={title}
              customerBudget={amount}
              onSubmit={handleQuoteSubmit}
              onViewQuotes={() => {
                setQuoteModalOpen(false)
                navigate('/tradesman/quotes')
              }}
            />
          ) : null}
        </>
      ) : null}
    </article>
  )
}
