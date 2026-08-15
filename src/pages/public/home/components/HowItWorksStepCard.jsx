import { cn } from '@/helpers/cn'

export default function HowItWorksStepCard({
  icon: Icon,
  iconClassName,
  step,
  title,
  description,
  stepLabel,
}) {
  return (
    <article className="relative rounded-3xl bg-white p-8 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-lg',
            iconClassName,
          )}
        >
          <Icon className="size-5" strokeWidth={2} />
        </div>

        <span className="text-5xl font-bold leading-none text-[#E8ECF0]">{step}</span>
      </div>

      <h3 className="mt-6 text-xl font-bold text-[#111827]">{title}</h3>
      <p className="mt-3 text-base leading-7 text-[#64748B]">{description}</p>
      <p className="mt-6 text-sm font-medium text-btn-primary">{stepLabel}</p>
    </article>
  )
}
