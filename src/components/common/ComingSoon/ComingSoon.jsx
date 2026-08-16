import { Construction } from 'lucide-react'

/**
 * Placeholder for dashboard routes until real pages are built.
 */
export default function ComingSoon({
  title = 'Coming Soon',
  description = 'This section is under development. Check back soon.',
}) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:min-h-[420px] sm:p-8 lg:min-h-[520px]">
      <div className="max-w-md px-2 text-center sm:px-0">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#EAF2FE] text-btn-primary sm:size-14">
          <Construction className="size-6 sm:size-7" strokeWidth={2} />
        </span>
        <h1 className="mt-5 text-xl font-bold text-[#111827] sm:mt-6 sm:text-2xl lg:text-3xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#64748B] sm:text-base sm:leading-7">
          {description}
        </p>
        <p className="mt-6 inline-flex rounded-full bg-[#F8FAFC] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
          Coming soon
        </p>
      </div>
    </div>
  )
}
