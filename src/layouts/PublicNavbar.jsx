import { useState, useEffect, useMemo } from 'react'
import { NavLink, Link, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/Logo'
import { cn } from '@/helpers/cn'
import { prefetchAuthImagesOnIntent } from '@/helpers/prefetchAuthImages'
import { useSectionInView } from '@/hooks/useSectionInView'
import { useAuth } from '@/auth/AuthProvider'
import PublicNavbarUserActions from '@/layouts/PublicNavbarUserActions'
import PublicNavbarTradesmanActions from '@/layouts/PublicNavbarTradesmanActions'
import PublicNavbarAdminActions from '@/layouts/PublicNavbarAdminActions'

const BASE_NAV_LINKS = [
  { label: 'Browse Job', to: '/jobs', matchPrefix: '/jobs' },
  { label: 'Categories', to: '/#categories', sectionId: 'categories' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
]

const USER_NAV_LINK = { label: 'My Job Post', to: '/my-jobs', matchPrefix: '/my-jobs' }

function isPathPrefixActive(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

function isNavLinkActive(link, location, defaultActive, sectionInView) {
  if (link.sectionId) {
    return location.pathname === '/' && sectionInView
  }

  if (link.matchPrefix) {
    return isPathPrefixActive(location.pathname, link.matchPrefix)
  }

  return defaultActive
}

export default function PublicNavbar() {
  const location = useLocation()
  const { pathname } = location
  const { isUser, isTradesman, isAdmin } = useAuth()
  const showAuthActions = isUser || isTradesman || isAdmin
  const hasGradientHero =
    pathname === '/' || pathname === '/jobs' || pathname === '/pricing' || pathname === '/about'
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const categoriesInView = useSectionInView('categories', pathname === '/')

  const navLinks = useMemo(
    () => (isUser ? [...BASE_NAV_LINKS, USER_NAV_LINK] : BASE_NAV_LINKS),
    [isUser],
  )

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
        <div
          className={cn(
            'container mx-auto grid h-[72px] items-center gap-4 px-5 lg:px-8',
            showAuthActions
              ? 'grid-cols-[1fr_auto] lg:grid-cols-[200px_1fr_auto]'
              : 'grid-cols-[1fr_auto] lg:grid-cols-[220px_1fr_220px]',
          )}
        >
          <Logo />

          <nav className="hidden items-center justify-center gap-6 xl:gap-8 lg:flex">
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
            <div className="hidden items-center lg:flex">
              {showAuthActions ? (
                isAdmin ? (
                  <PublicNavbarAdminActions />
                ) : isUser ? (
                  <PublicNavbarUserActions />
                ) : (
                  <PublicNavbarTradesmanActions />
                )
              ) : (
                <div className="flex items-center gap-3">
                  <NavLink
                    to="/auth/login"
                    onMouseEnter={prefetchAuthImagesOnIntent}
                    onFocus={prefetchAuthImagesOnIntent}
                    className="rounded-full bg-btn-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/auth/signup"
                    onMouseEnter={prefetchAuthImagesOnIntent}
                    onFocus={prefetchAuthImagesOnIntent}
                    className="rounded-full border border-[#E5E7EB] bg-white px-6 py-2.5 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#F8FAFC]"
                  >
                    Register
                  </NavLink>
                </div>
              )}
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

      <aside
        className={cn(
          'fixed top-0 right-0 z-40 flex h-full w-[300px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
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

        <div className="border-t border-[#F1F5F9] p-5">
          {showAuthActions ? (
            isAdmin ? (
              <PublicNavbarAdminActions compact />
            ) : isUser ? (
              <PublicNavbarUserActions compact />
            ) : (
              <PublicNavbarTradesmanActions compact />
            )
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/auth/login"
                onMouseEnter={prefetchAuthImagesOnIntent}
                onFocus={prefetchAuthImagesOnIntent}
                className="flex h-11 items-center justify-center rounded-full bg-btn-primary text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
              >
                Login
              </Link>
              <Link
                to="/auth/signup"
                onMouseEnter={prefetchAuthImagesOnIntent}
                onFocus={prefetchAuthImagesOnIntent}
                className="flex h-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-sm font-semibold text-[#111827] transition-colors hover:bg-[#F8FAFC]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
