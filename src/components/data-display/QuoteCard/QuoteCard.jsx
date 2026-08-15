import {
  Eye,
  MessageCircle,
  Pencil,
  Star,
  Trash2,
} from 'lucide-react'
import { cn } from '@/helpers/cn'

const STATUS_STYLES = {
  pending: 'bg-[#FFF7ED] text-[#EA580C]',
  accepted: 'bg-[#ECFDF5] text-[#059669]',
  rejected: 'bg-[#FEF2F2] text-[#DC2626]',
  withdrawn: 'bg-[#F1F5F9] text-[#64748B]',
  submitted: 'bg-[#FFFBEB] text-[#D97706]',
}

const OUTLINE_BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-medium text-[var(--primary-text)] transition-colors hover:bg-[#F8FAFC] sm:px-4'

const OUTLINE_PRIMARY_BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-btn-primary bg-white px-4 py-2 text-sm font-semibold text-btn-primary transition-colors hover:bg-[#EFF6FF]'

function RatingStars({ rating }) {
  const fullStars = Math.floor(rating)

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            'size-3.5 sm:size-4',
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
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--secondary-text)] sm:text-xs">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--primary-text)]">{value}</p>
    </div>
  )
}

function TradesmanQuoteCard({
  quoteId,
  status,
  statusVariant = 'pending',
  postedAt,
  amount,
  title,
  customerName,
  duration,
  tokensUsed,
  description,
  onViewDetails,
  onEditQuote,
  onWithdraw,
  onMessageCustomer,
  messageLabel = 'Message customer',
  className = '',
}) {
  return (
    <article
      className={cn(
        'rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6',
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
              STATUS_STYLES[statusVariant] ?? STATUS_STYLES.pending,
            )}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {status}
          </span>
          <span className="text-xs text-[var(--secondary-text)] sm:text-sm">
            {quoteId} · {postedAt}
          </span>
        </div>

        <p className="text-2xl font-bold text-[var(--primary-text)] sm:text-right">
          {amount}
        </p>
      </div>

      <div className="mt-5 min-w-0">
        <h3 className="text-base font-semibold text-[var(--primary-text)] sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 text-sm text-[var(--secondary-text)]">
          {customerName} · {duration} · {tokensUsed} tokens used
        </p>
        <p className="mt-3 text-sm leading-6 text-[var(--secondary-text)]">
          {description}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {onViewDetails ? (
            <button type="button" onClick={onViewDetails} className={OUTLINE_BUTTON}>
              <Eye className="size-4 shrink-0" />
              View details
            </button>
          ) : null}

          {onEditQuote ? (
            <button type="button" onClick={onEditQuote} className={OUTLINE_BUTTON}>
              <Pencil className="size-4 shrink-0" />
              Edit quote
            </button>
          ) : null}

          {onWithdraw ? (
            <button
              type="button"
              onClick={onWithdraw}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#FECACA] bg-white px-3 py-2 text-sm font-medium text-[#DC2626] transition-colors hover:bg-[#FEF2F2] sm:px-4"
            >
              <Trash2 className="size-4 shrink-0" />
              Withdraw
            </button>
          ) : null}
        </div>

        {onMessageCustomer ? (
          <button
            type="button"
            onClick={onMessageCustomer}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-btn-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] lg:w-auto lg:shrink-0"
          >
            <MessageCircle className="size-4 shrink-0" />
            {messageLabel}
          </button>
        ) : null}
      </div>
    </article>
  )
}

function CustomerQuoteCard({
  tradesman,
  amount,
  duration,
  startDate,
  distance,
  responseTime,
  submittedAt,
  proposalPreview,
  statusVariant = 'submitted',
  onViewDetails,
  viewDetailsLabel = 'View details',
  className = '',
}) {
  const {
    name,
    initials,
    avatar = null,
    rating,
    reviewCount,
    jobsCompleted,
    yearsExperience,
  } = tradesman || {}

  return (
    <article
      className={cn(
        'rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6',
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0891B2] text-sm font-bold text-white sm:size-14 sm:text-base">
            {avatar ? (
              <img src={avatar} alt="" className="size-full object-cover" />
            ) : (
              initials
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-[var(--primary-text)] sm:text-lg">
              {name}
            </h3>
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

        <div className="sm:text-right">
          <p className="text-2xl font-bold text-btn-primary sm:text-3xl">{amount}</p>
          <p className="mt-0.5 text-xs text-[var(--secondary-text)] sm:text-sm">
            Total quote
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricBox label="Duration" value={duration} />
        <MetricBox label="Start date" value={startDate} />
        <MetricBox label="Distance" value={distance} />
        <MetricBox label="Response time" value={responseTime} />
      </div>

      {submittedAt ? (
        <span
          className={cn(
            'mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold',
            STATUS_STYLES[statusVariant] ?? STATUS_STYLES.submitted,
          )}
        >
          {submittedAt}
        </span>
      ) : null}

      <div className="mt-4 rounded-xl bg-[#F8FAFC] p-4 sm:p-5">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--secondary-text)] sm:text-xs">
          Proposal preview
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--primary-text)]">
          {proposalPreview}
        </p>
      </div>

      {onViewDetails ? (
        <div className="mt-5">
          <button type="button" onClick={onViewDetails} className={OUTLINE_PRIMARY_BUTTON}>
            {viewDetailsLabel}
          </button>
        </div>
      ) : null}
    </article>
  )
}

/**
 * Prop-driven quote card for tradesman and customer dashboards.
 * Pass variant and callbacks from the parent — component never navigates itself.
 */
export default function QuoteCard({
  variant = 'tradesman',
  tradesman,
  amount,
  duration,
  startDate,
  distance,
  responseTime,
  submittedAt,
  proposalPreview,
  viewDetailsLabel,
  quoteId,
  status,
  statusVariant,
  postedAt,
  title,
  customerName,
  tokensUsed,
  description,
  onViewDetails,
  onEditQuote,
  onWithdraw,
  onMessageCustomer,
  messageLabel,
  className = '',
}) {
  if (variant === 'customer') {
    return (
      <CustomerQuoteCard
        tradesman={tradesman}
        amount={amount}
        duration={duration}
        startDate={startDate}
        distance={distance}
        responseTime={responseTime}
        submittedAt={submittedAt}
        proposalPreview={proposalPreview}
        statusVariant={statusVariant}
        onViewDetails={onViewDetails}
        viewDetailsLabel={viewDetailsLabel}
        className={className}
      />
    )
  }

  return (
    <TradesmanQuoteCard
      quoteId={quoteId}
      status={status}
      statusVariant={statusVariant}
      postedAt={postedAt}
      amount={amount}
      title={title}
      customerName={customerName}
      duration={duration}
      tokensUsed={tokensUsed}
      description={description}
      onViewDetails={onViewDetails}
      onEditQuote={onEditQuote}
      onWithdraw={onWithdraw}
      onMessageCustomer={onMessageCustomer}
      messageLabel={messageLabel}
      className={className}
    />
  )
}
