import { Check, Coins, PoundSterling } from 'lucide-react'
import { cn } from '@/helpers/cn'

const ICONS = {
  tokens: PoundSterling,
  used: Coins,
  purchased: Check,
}

const TONE_STYLES = {
  teal: 'bg-[#ECFEFF] text-[#0891B2]',
  orange: 'bg-[#FFF7ED] text-[#EA580C]',
  green: 'bg-[#ECFDF5] text-[#059669]',
  blue: 'bg-[#EFF6FF] text-[#2563EB]',
  purple: 'bg-[#F5F3FF] text-[#7C3AED]',
  yellow: 'bg-[#FEFCE8] text-[#CA8A04]',
  pink: 'bg-[#FDF2F8] text-[#DB2777]',
  red: 'bg-[#FEF2F2] text-[#DC2626]',
}

/**
 * Wallet / dashboard stat card. Pass iconTone for colour variant.
 */
export default function WalletStatCard({
  label,
  value,
  subtext,
  icon = 'tokens',
  iconTone = 'teal',
  uppercaseLabel = false,
  subtextClassName = '',
  className = '',
}) {
  const Icon = typeof icon === 'string' ? ICONS[icon] ?? PoundSterling : icon

  return (
    <article
      className={cn(
        'rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            'text-sm text-[var(--secondary-text)]',
            uppercaseLabel && 'text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]',
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full',
            TONE_STYLES[iconTone] ?? TONE_STYLES.teal,
          )}
        >
          <Icon className="size-4" strokeWidth={2} />
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem] lg:text-[2rem]">
        {value}
      </p>

      {subtext ? (
        <p className={cn('mt-1 text-sm text-[var(--secondary-text)]', subtextClassName)}>{subtext}</p>
      ) : null}
    </article>
  )
}
