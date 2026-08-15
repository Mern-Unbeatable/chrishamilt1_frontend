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
        <p className="text-sm text-[var(--secondary-text)]">{label}</p>
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full',
            TONE_STYLES[iconTone] ?? TONE_STYLES.teal,
          )}
        >
          <Icon className="size-4" strokeWidth={2} />
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold text-[var(--primary-text)] sm:text-4xl">
        {value}
      </p>

      {subtext ? (
        <p className="mt-1 text-sm text-[var(--secondary-text)]">{subtext}</p>
      ) : null}
    </article>
  )
}
