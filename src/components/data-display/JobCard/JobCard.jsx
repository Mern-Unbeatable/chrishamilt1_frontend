import {
  ChevronRight,
  Clock,
  MapPin,
  Pencil,
  PoundSterling,
  Trash2,
} from 'lucide-react'
import StatusBadge from '@/components/data-display/DataTable/StatusBadge'
import { canCancelBooking } from '@/data/myBookingsData'
import { cn } from '@/helpers/cn'

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
  onViewLead,
  viewLeadLabel = 'View Lead',
  onOpen,
  onCancel,
  cancelLabel = 'Cancel Booking',
  onViewQuote,
  viewQuoteLabel = 'View Quote',
  onEdit,
  onDelete,
  className = '',
}) {
  const amount = price ?? priceRange
  const showCancel = variant === 'booking' && canCancelBooking(status) && onCancel

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
                <h3 className="text-base font-semibold text-[#111827] sm:text-lg">{title}</h3>
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
                <span className="inline-flex shrink-0 self-start rounded-md border border-[#E5E7EB] px-3 py-1 text-xs font-medium text-[#64748B]">
                  {category}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              aria-label="Delete job"
              className="inline-flex size-10 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#EF4444] transition-colors hover:bg-[#FEE2E2]"
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
          {variant === 'booking' && onOpen ? (
            <button
              type="button"
              onClick={onOpen}
              className="text-left text-base font-semibold text-(--primary-text) transition-colors hover:text-btn-primary sm:text-lg"
            >
              {title}
            </button>
          ) : variant === 'browse' && onViewLead ? (
            <button
              type="button"
              onClick={onViewLead}
              className="text-left text-base font-semibold text-(--primary-text) transition-colors hover:text-btn-primary sm:text-lg"
            >
              {title}
            </button>
          ) : (
            <h3 className="text-base font-semibold text-(--primary-text) sm:text-lg">{title}</h3>
          )}

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

            {variant === 'booking' && amount ? (
              <span className="font-semibold text-[#111827]">{amount}</span>
            ) : null}

            {variant === 'browse' && amount ? (
              <span className="inline-flex items-center gap-1.5">
                <PoundSterling className="size-4 shrink-0" />
                {amount}
              </span>
            ) : null}

            {variant === 'browse' && postedAt ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4 shrink-0" />
                {postedAt}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {variant === 'browse' ? (
        <div className="flex w-full shrink-0 flex-col items-stretch gap-3 sm:w-auto sm:items-end sm:gap-4">
          {category ? (
            <span className="self-start rounded-md border border-[#E5E7EB] px-3 py-1 text-xs font-medium text-(--secondary-text)">
              {category}
            </span>
          ) : null}

          {onViewLead ? (
            <button
              type="button"
              onClick={onViewLead}
              className="w-full rounded-lg bg-btn-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] sm:w-auto"
            >
              {viewLeadLabel}
            </button>
          ) : null}
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
    </article>
  )
}
