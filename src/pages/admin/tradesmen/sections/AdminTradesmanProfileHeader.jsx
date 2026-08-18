import { ChevronLeft, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router'
import { StatusBadge } from '@/components/data-display/DataTable/DataTable'
import { cn } from '@/helpers/cn'

export default function AdminTradesmanProfileHeader({
  tradesman,
  onSuspend,
  onDelete,
  className = '',
}) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5',
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#F5F3FF] text-xl font-bold text-[#7C3AED] sm:size-[72px] sm:text-2xl">
            {tradesman.initials}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-[#111827] sm:text-2xl">
                {tradesman.tradesmanName}
              </h1>
              <StatusBadge status={tradesman.status} />
            </div>

            <div className="mt-3 space-y-2 text-sm text-[#64748B]">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
                <span className="whitespace-pre-line">{tradesman.location}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" strokeWidth={2} />
                <span>{tradesman.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" strokeWidth={2} />
                <span>{tradesman.phoneNumber}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <button
            type="button"
            onClick={onSuspend}
            className="inline-flex h-11 min-w-[160px] items-center justify-center rounded-lg bg-[#FFF7ED] px-5 text-sm font-semibold text-[#EA580C] transition-colors hover:bg-[#FFEDD5]"
          >
            Suspend Account
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-11 min-w-[160px] items-center justify-center rounded-lg bg-[#FEF2F2] px-5 text-sm font-semibold text-[#DC2626] transition-colors hover:bg-[#FEE2E2]"
          >
            Delete Account
          </button>
        </div>
      </div>
    </section>
  )
}

export function AdminTradesmanBackLink() {
  return (
    <Link
      to="/admin/tradesmen"
      className="inline-flex items-center gap-1 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
    >
      <ChevronLeft className="size-4 shrink-0" strokeWidth={2} />
      Back
    </Link>
  )
}
