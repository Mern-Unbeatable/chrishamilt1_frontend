import { LogOut, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router'
import Logo from '@/components/Logo'
import { clearDemoSession } from '@/auth/demoAuth'
import { cn } from '@/helpers/cn'
import { DASHBOARD_HEADER_CLASS } from '@/layouts/dashboard/constants'

export default function DashboardSidebar({
  navItems = [],
  mobileOpen = false,
  onClose,
}) {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearDemoSession()
    navigate('/auth/login', { replace: true })
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-[#111827]/40 transition-opacity duration-300 lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-screen w-[min(280px,88vw)] flex-col border-r border-[#E5E7EB] bg-white transition-transform duration-300 ease-in-out lg:w-[260px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between border-b border-[#E5E7EB] px-4 sm:px-6',
            DASHBOARD_HEADER_CLASS,
          )}
        >
          <Logo className="[&_img]:h-10" />

          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#111827] lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-5" strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-3 py-5 sm:px-4 sm:py-6">
          <p className="px-3 text-xs font-medium text-[#94A3B8]">Main menu</p>

          <nav className="mt-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded px-4 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-btn-primary text-white'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111827]',
                    )
                  }
                >
                  <Icon className="size-[18px] shrink-0" strokeWidth={2} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 rounded px-4 py-2.5 text-sm font-medium text-[#DC2626] transition-colors hover:bg-[#FEF2F2]"
          >
            <LogOut className="size-[18px] shrink-0" strokeWidth={2} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  )
}
