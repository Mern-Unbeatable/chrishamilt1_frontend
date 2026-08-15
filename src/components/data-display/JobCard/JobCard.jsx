import { Clock, MapPin, PoundSterling } from 'lucide-react'
import { cn } from '@/helpers/cn'

/**
 * Prop-driven job list card. Pass onViewLead from parent — component never navigates itself.
 */
export default function JobCard({
  title,
  location,
  priceRange,
  postedAt,
  category,
  onViewLead,
  viewLeadLabel = 'View Lead',
  className = '',
}) {
  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-6',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold text-[var(--primary-text)]">{title}</h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--secondary-text)]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4 shrink-0" />
            {location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PoundSterling className="size-4 shrink-0" />
            {priceRange}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 shrink-0" />
            {postedAt}
          </span>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col items-stretch gap-3 sm:w-auto sm:items-end sm:gap-4">
        <span className="self-start rounded-md border border-[#E5E7EB] px-3 py-1 text-xs font-medium text-[var(--secondary-text)]">
          {category}
        </span>

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
    </article>
  )
}
