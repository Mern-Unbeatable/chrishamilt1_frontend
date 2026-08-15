import { Check } from 'lucide-react'
import { cn } from '@/helpers/cn'

export default function WhyPreferFeatureCard({
  icon: Icon,
  iconClassName,
  title,
  description,
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#E5E7EB] bg-white p-8">
      <div
        className={cn(
          'flex size-12 items-center justify-center rounded-full',
          iconClassName,
        )}
      >
        <Icon className="size-5" strokeWidth={2} />
      </div>

      <h3 className="mt-6 text-xl font-bold text-[#111827]">{title}</h3>
      <p className="mt-3 flex-1 text-base leading-7 text-[#64748B]">{description}</p>

      <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-btn-primary">
        <Check className="size-4" strokeWidth={2.5} />
        Standard on TradeTrust UK
      </p>
    </article>
  )
}
