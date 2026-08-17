import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/helpers/cn'

const STATUS_STYLES = {
  pending: 'bg-[#FFF7ED] text-[#EA580C]',
  accepted: 'bg-[#ECFDF5] text-[#059669]',
  rejected: 'bg-[#FEF2F2] text-[#DC2626]',
  withdrawn: 'bg-[#F1F5F9] text-[#64748B]',
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] py-3 last:border-b-0">
      <dt className="text-sm text-[#64748B]">{label}</dt>
      <dd className="text-right text-sm font-semibold text-[#111827]">{value}</dd>
    </div>
  )
}

export default function TradesmanQuoteDetailsModal({ open, quote, onClose }) {
  useEffect(() => {
    if (!open) return undefined

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
        aria-labelledby="tradesman-quote-details-title"
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                  STATUS_STYLES[quote.statusVariant] ?? STATUS_STYLES.pending,
                )}
              >
                <span className="size-1.5 rounded-full bg-current" />
                {quote.status}
              </span>
              <span className="text-xs text-[#64748B] sm:text-sm">
                {quote.quoteId} · {quote.postedAt}
              </span>
            </div>
            <h2
              id="tradesman-quote-details-title"
              className="mt-3 text-xl font-bold text-[#111827] sm:text-2xl"
            >
              {quote.title}
            </h2>
          </div>

          <div className="flex shrink-0 items-start gap-3">
            <p className="text-2xl font-bold text-[#111827]">{quote.amount}</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex size-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#111827]"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <dl>
            <DetailRow label="Customer" value={quote.customerName} />
            <DetailRow label="Duration" value={quote.duration} />
            <DetailRow label="Start date" value={quote.startDate} />
            <DetailRow label="Tokens used" value={String(quote.tokensUsed)} />
            <DetailRow
              label="Materials"
              value={quote.materialsIncluded ? 'Included' : 'Not included'}
            />
            {quote.warranty ? <DetailRow label="Warranty" value={quote.warranty} /> : null}
          </dl>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Full proposal
            </p>
            <div className="mt-3 rounded-xl bg-[#F8FAFC] p-4 sm:p-5">
              <p className="text-sm leading-7 text-[#111827]">
                {quote.fullProposal ?? quote.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
