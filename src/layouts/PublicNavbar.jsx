import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/Logo'
import { cn } from '@/helpers/cn'
import { useSectionInView } from '@/hooks/useSectionInView'

const navLinks = [
  { label: 'Browse Job', to: '/jobs' },
  { label: 'Categories', to: '/#categories', sectionId: 'categories' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  // { label: 'My Job Post', to: '/auth/signup' },
]

function isNavLinkActive(link, location, defaultActive, sectionInView) {
  if (link.sectionId) {
    return location.pathname === '/' && sectionInView
  }

  return defaultActive
}

export default function PublicNavbar() {
  const location = useLocation()
  const { pathname } = location
  const hasGradientHero =
    pathname === '/' || pathname === '/jobs' || pathname === '/pricing' || pathname === '/about'
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const categoriesInView = useSectionInView('categories', pathname === '/')

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isSolid = !hasGradientHero || scrolled

  return (
    <>
      <div
        className={cn(
          'w-full transition-[background-color,box-shadow,border-color] duration-200',
          isSolid ? 'bg-secondary' : 'bg-transparent',
        )}
      >
        <div className="container mx-auto grid h-[72px] grid-cols-[1fr_auto] items-center gap-4 px-5 lg:grid-cols-[220px_1fr_220px] lg:px-8">
          <Logo />

          <nav className="hidden items-center justify-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-btn-primary',
                    isNavLinkActive(
                      link,
                      location,
                      isActive,
                      link.sectionId === 'categories' ? categoriesInView : false,
                    )
                      ? 'text-btn-primary'
                      : 'text-[#64748B]',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <div className="hidden items-center gap-3 lg:flex">
              <NavLink to="/auth/login" className="rounded-full bg-btn-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]">
                Login
              </NavLink>
              <NavLink to="/auth/signup" className="rounded-full border border-[#E5E7EB] bg-white px-6 py-2.5 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#F8FAFC]">
                Register
              </NavLink>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex size-10 items-center justify-center rounded-lg text-[#374151] transition-colors hover:bg-black/5 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        onClick={() => setOpen(false)}
        className={cn(
          'fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      />

      <aside className={cn(
        'fixed top-0 right-0 z-40 flex h-full w-[300px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden',
        open ? 'translate-x-0' : 'translate-x-full',
      )}>
        <div className="flex h-[72px] items-center justify-between border-b border-[#F1F5F9] px-5">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex size-9 items-center justify-center rounded-lg text-[#374151] transition-colors hover:bg-[#F1F5F9]"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-5">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  isNavLinkActive(
                    link,
                    location,
                    isActive,
                    link.sectionId === 'categories' ? categoriesInView : false,
                  )
                    ? 'bg-[#EFF6FF] text-btn-primary'
                    : 'text-[#374151] hover:bg-[#F8FAFC]',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-3 border-t border-[#F1F5F9] p-5">
          <Link to="/auth/login" className="flex h-11 items-center justify-center rounded-full bg-btn-primary text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]">
            Login
          </Link>
          <Link to="/auth/signup" className="flex h-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-sm font-semibold text-[#111827] transition-colors hover:bg-[#F8FAFC]">
            Register
          </Link>
        </div>
      </aside>
    </>
  )
}
