import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import { LayoutDashboard, LogOut, MessageSquare, Package } from 'lucide-react'
import { useAuth } from '@/auth/AuthProvider'
import { cn } from '@/helpers/cn'

function isPathPrefixActive(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export default function PublicNavbarTradesmanActions({ compact = false }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { logout } = useAuth()

  const isMessagesActive = isPathPrefixActive(pathname, '/tradesman/messages')
  const isQuotesActive = isPathPrefixActive(pathname, '/tradesman/quotes')
  const isDashboardActive = isPathPrefixActive(pathname, '/tradesman/dashboard')

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const iconButtonClass = (active) =>
    cn(
      'flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-white/80 hover:text-btn-primary',
      active ? 'text-btn-primary' : 'text-[#64748B]',
    )

  const compactLinkClass = ({ isActive }) =>
    cn(
      'flex h-11 items-center gap-3 rounded-lg px-4 text-sm font-medium transition-colors',
      isActive ? 'bg-[#EFF6FF] text-btn-primary' : 'text-[#374151] hover:bg-[#F8FAFC]',
    )

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <NavLink
          to="/tradesman/messages"
          className={compactLinkClass}
          isActive={(_, location) =>
            isPathPrefixActive(location.pathname, '/tradesman/messages')
          }
        >
          <MessageSquare className="size-4" />
          Messages
        </NavLink>
        <NavLink
          to="/tradesman/quotes"
          className={compactLinkClass}
          isActive={(_, location) =>
            isPathPrefixActive(location.pathname, '/tradesman/quotes')
          }
        >
          <Package className="size-4" />
          My Quotes
        </NavLink>
        <NavLink
          to="/tradesman/dashboard"
          className={compactLinkClass}
          isActive={(_, location) =>
            isPathPrefixActive(location.pathname, '/tradesman/dashboard')
          }
        >
          <LayoutDashboard className="size-4" />
          Dashboard
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-11 items-center gap-3 rounded-lg px-4 text-sm font-medium text-[#374151] hover:bg-[#F8FAFC]"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Link
        to="/tradesman/messages"
        className={iconButtonClass(isMessagesActive)}
        aria-label="Messages"
        aria-current={isMessagesActive ? 'page' : undefined}
      >
        <MessageSquare className="size-5" strokeWidth={1.75} />
      </Link>

      <Link
        to="/tradesman/quotes"
        className={iconButtonClass(isQuotesActive)}
        aria-label="My quotes"
        aria-current={isQuotesActive ? 'page' : undefined}
      >
        <Package className="size-5" strokeWidth={1.75} />
      </Link>

      <Link
        to="/tradesman/dashboard"
        aria-current={isDashboardActive ? 'page' : undefined}
        className={cn(
          'ml-1 inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors sm:px-5',
          isDashboardActive
            ? 'bg-[#0150CC] text-white'
            : 'bg-btn-primary text-white hover:bg-[#0150CC]',
        )}
      >
        Dashboard
      </Link>
    </div>
  )
}
