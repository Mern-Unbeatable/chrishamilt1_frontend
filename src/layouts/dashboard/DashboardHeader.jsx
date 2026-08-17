import { Menu } from 'lucide-react'
import Logo from '@/components/Logo'
import { useAuth } from '@/auth/AuthProvider'
import { cn } from '@/helpers/cn'
import { DASHBOARD_HEADER_CLASS } from '@/layouts/dashboard/constants'

export default function DashboardHeader({ onMenuOpen }) {
  const { session } = useAuth()

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#E5E7EB] bg-white px-4 sm:px-6 lg:px-8',
        DASHBOARD_HEADER_CLASS,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#111827] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" strokeWidth={2} />
        </button>
        <Logo className="lg:hidden [&_img]:h-9" />
      </div>

      <div className="min-w-0 text-right">
        <p className="truncate text-sm font-semibold text-[#111827]">
          {session?.name || 'Guest User'}
        </p>
        <p className="truncate text-xs text-[#64748B]">
          {session?.roleLabel || 'Account'}
        </p>
      </div>
    </header>
  )
}
