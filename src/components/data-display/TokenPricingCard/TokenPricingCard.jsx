import { cn } from '@/helpers/cn'

/**
 * Token pricing plan card. Set featured for highlighted / most popular plan.
 * Pass onBuyTokens from parent — component never navigates itself.
 */
export default function TokenPricingCard({
  planName,
  price,
  tokens,
  rateLabel,
  description,
  featured = false,
  badgeLabel = 'Most popular',
  onBuyTokens,
  buyLabel = 'Buy Tokens',
  className = '',
}) {
  return (
    <article
      className={cn(
        'relative flex h-full flex-col rounded-2xl border bg-white p-5 sm:p-6',
        featured ? 'border-2 border-btn-primary shadow-sm' : 'border-[#E5E7EB]',
        className,
      )}
    >
      {featured ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-btn-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs">
          {badgeLabel}
        </span>
      ) : null}

      <p
        className={cn(
          'text-xs font-bold uppercase tracking-wide',
          featured ? 'text-btn-primary' : 'text-[var(--secondary-text)]',
        )}
      >
        {planName}
      </p>

      <p className="mt-4 text-4xl lg:text-5xl font-extrabold text-[var(--primary-text)]">{price}</p>

      <p className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-btn-primary sm:text-lg lg:text-2xl">
        <span className="flex size-6 items-center justify-center rounded-full border border-btn-primary text-xs font-bold">
          T
        </span>
        {tokens} Tokens
      </p>

      <p className="mt-5 text-sm text-[var(--secondary-text)] lg:text-base">{rateLabel}</p>
      <p className="mt-4 flex-1 text-sm leading-6 text-[var(--secondary-text)] lg:text-base">
        {description}
      </p>

      {onBuyTokens ? (
        <button
          type="button"
          onClick={onBuyTokens}
          className="mt-6 w-full rounded-xl bg-btn-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] lg:text-base"
        >
          {buyLabel}
        </button>
      ) : null}
    </article>
  )
}
