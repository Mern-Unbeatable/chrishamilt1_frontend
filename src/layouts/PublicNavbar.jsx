import { NavLink, useLocation } from 'react-router'
import Logo from '@/components/Logo'
import { cn } from '@/helpers/cn'

const navLinks = [
  { label: 'Browse Job', to: '/services' },
  { label: 'Categories', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'My Job Post', to: '/user/bookings' },
]

export default function PublicNavbar() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div
      className={cn(
        'relative z-20',
        isHome ? 'bg-transparent' : 'border-b border-border bg-white',
      )}
    >
      <div className="container mx-auto grid h-[72px] grid-cols-[1fr_auto] items-center gap-4 px-6 lg:grid-cols-[220px_1fr_220px] lg:px-8">
        <Logo />

        <nav className="hidden items-center justify-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors hover:text-[#111827]',
                  isActive ? 'text-[#111827]' : 'text-[#64748B]',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <NavLink
            to="/auth/login"
            className="rounded-full bg-btn-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
          >
            Login
          </NavLink>
          <NavLink
            to="/auth/register"
            className="rounded-full border border-[#E5E7EB] bg-white px-6 py-2.5 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#F8FAFC]"
          >
            Register
          </NavLink>
        </div>
      </div>
    </div>
  )
}
