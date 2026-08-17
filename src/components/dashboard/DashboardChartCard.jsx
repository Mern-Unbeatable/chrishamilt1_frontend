import { cn } from '@/helpers/cn'

export default function DashboardChartCard({
  title,
  subtitle,
  badge = null,
  children,
  className = '',
}) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-[#64748B]">{subtitle}</p>
          ) : null}
        </div>
        {badge}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}
