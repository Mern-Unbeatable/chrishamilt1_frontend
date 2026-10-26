import { Clock, Flame, Mail, MapPin, Navigation, ShoppingCart } from 'lucide-react'
import { cn } from '@/helpers/cn'

const URGENCY_STYLES = {
  high: 'bg-[#FEF3C7] text-[#D97706]',
  medium: 'bg-[#EFF6FF] text-[#2563EB]',
  low: 'bg-[#ECFDF5] text-[#059669]',
}

export default function JobDetailsSummary({
  job,
  onSendQuote,
  sendQuoteLabel = 'Buy This',
  sendQuoteDisabled = false,
}) {
  const {
    category,
    urgency,
    urgencyVariant = 'high',
    status,
    title,
    location,
    city,
    postedAt,
    distance,
    price,
  } = job

  const fullLocation = [location, city]
    .filter(Boolean)
    .filter((val, idx, arr) => arr.indexOf(val) === idx)
    .join(', ')

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-md bg-[#1E3A5F] px-3 py-1 text-xs font-semibold text-white">
            {category}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold',
              URGENCY_STYLES[urgencyVariant] ?? URGENCY_STYLES.high,
            )}
          >
            {urgencyVariant === 'high' ? <Flame className="size-3.5" /> : null}
            {urgency}
          </span>
        </div>

        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#059669]">
          <span className="size-2 rounded-full bg-[#059669]" />
          {status}
        </span>
      </div>

      <h1 className="mt-5 text-2xl font-bold tracking-[-0.02em] text-[var(--primary-text)] sm:text-3xl lg:text-[2rem]">
        {title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--secondary-text)]">
        {fullLocation ? (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4 shrink-0 text-btn-primary" />
            {fullLocation}
          </span>
        ) : null}
        {city ? (
          <span className="inline-flex items-center rounded-md bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-medium text-[#475569]">
            City: {city}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4 shrink-0" />
          {postedAt}
        </span>
        {distance ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-btn-primary">
            <Navigation className="size-4 shrink-0" />
            {distance}
          </span>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-2xl font-bold text-[var(--primary-text)]">{price}</p>

        {onSendQuote ? (
          <button
            type="button"
            onClick={onSendQuote}
            disabled={sendQuoteDisabled}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-btn-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {sendQuoteLabel.toLowerCase().includes('buy') ? (
              <ShoppingCart className="size-4" />
            ) : (
              <Mail className="size-4" />
            )}
            {sendQuoteLabel}
          </button>
        ) : null}
      </div>
    </section>
  )
}
