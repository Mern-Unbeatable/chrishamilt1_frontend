import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import { Briefcase, LogOut, MessageSquare, Package, User } from 'lucide-react'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@/components/Dropdown'
import { useAuth } from '@/auth/AuthProvider'
import { cn } from '@/helpers/cn'

function isPathPrefixActive(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export default function PublicNavbarUserActions({ compact = false }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { logout } = useAuth()

  const isMyBookingsActive = isPathPrefixActive(pathname, '/my-bookings')
  const isMessagesActive = isPathPrefixActive(pathname, '/messages')
  const isProfileActive = isPathPrefixActive(pathname, '/user/profile')
  const isPostJobActive = pathname === '/post-job'

  const handleLogout = () => {
    logout()
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
        <NavLink to="/user/profile" className={compactLinkClass} end>
          <User className="size-4" />
          Profile
        </NavLink>
        <NavLink
          to="/my-bookings"
          className={compactLinkClass}
          isActive={(_, location) => isPathPrefixActive(location.pathname, '/my-bookings')}
        >
          <Package className="size-4" />
          My Booking
        </NavLink>
        <NavLink
          to="/my-jobs"
          className={compactLinkClass}
          isActive={(_, location) => isPathPrefixActive(location.pathname, '/my-jobs')}
        >
          <Briefcase className="size-4" />
          My Job Post
        </NavLink>
        <NavLink to="/messages" className={compactLinkClass} end>
          <MessageSquare className="size-4" />
          Messages
        </NavLink>
        <NavLink
          to="/post-job"
          end
          className={({ isActive }) =>
            cn(
              'flex h-11 items-center justify-center rounded-lg text-sm font-semibold transition-colors',
              isActive
                ? 'bg-[#0150CC] text-white'
                : 'bg-btn-primary text-white hover:bg-[#0150CC]',
            )
          }
        >
          Post a Job
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
      <Dropdown className="relative">
        <DropdownTrigger
          className={cn(
            'size-10 shrink-0 justify-center rounded-lg border-0 bg-transparent p-0 shadow-none hover:bg-white/80 hover:text-btn-primary',
            isProfileActive ? 'text-btn-primary' : 'text-[#64748B]',
          )}
          aria-label="Account menu"
        >
          <User className="size-5" strokeWidth={1.75} />
        </DropdownTrigger>
        <DropdownMenu align="right" className="min-w-[168px]">
          <DropdownItem
            className="gap-2 text-[#374151] hover:text-btn-primary"
            onClick={() => navigate('/user/profile')}
          >
            <User className="size-4" />
            Profile
          </DropdownItem>
          <DropdownItem
            className="gap-2 text-[#374151] hover:text-[#DC2626]"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Log out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Link
        to="/my-bookings"
        className={iconButtonClass(isMyBookingsActive)}
        aria-label="My bookings"
        aria-current={isMyBookingsActive ? 'page' : undefined}
      >
        <Package className="size-5" strokeWidth={1.75} />
      </Link>

      <Link
        to="/messages"
        className={iconButtonClass(isMessagesActive)}
        aria-label="Messages"
        aria-current={isMessagesActive ? 'page' : undefined}
      >
        <MessageSquare className="size-5" strokeWidth={1.75} />
      </Link>

      <Link
        to="/post-job"
        aria-current={isPostJobActive ? 'page' : undefined}
        className={cn(
          'ml-1 inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors sm:px-5',
          isPostJobActive
            ? 'bg-[#0150CC] text-white'
            : 'bg-btn-primary text-white hover:bg-[#0150CC]',
        )}
      >
        Post a Job
      </Link>
    </div>
  )
}
