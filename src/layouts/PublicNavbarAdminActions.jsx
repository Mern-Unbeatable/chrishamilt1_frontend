import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '@/auth/AuthProvider'
import { cn } from '@/helpers/cn'

function isPathPrefixActive(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

const loginButtonClass =
  'inline-flex items-center justify-center rounded-full bg-btn-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]'

const registerButtonClass =
  'inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-[#111827] transition-colors bg-[#F8FAFC]'

export default function PublicNavbarAdminActions({ compact = false }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { logout } = useAuth()
  const isDashboardActive = isPathPrefixActive(pathname, '/admin')

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        <Link
          to="/admin/dashboard"
          aria-current={isDashboardActive ? 'page' : undefined}
          className={cn(loginButtonClass, 'h-11 w-full', isDashboardActive && 'bg-[#0150CC]')}
        >
          Dashboard
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className={cn(registerButtonClass, 'h-11 w-full')}
        >
          Log out
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={handleLogout} className={registerButtonClass}>
        Log out
      </button>
      <Link
        to="/admin/dashboard"
        aria-current={isDashboardActive ? 'page' : undefined}
        className={cn(loginButtonClass, isDashboardActive && 'bg-[#0150CC]')}
      >
        Dashboard
      </Link>
    </div>
  )
}
