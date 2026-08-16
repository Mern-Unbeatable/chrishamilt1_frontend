import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import DashboardHeader from '@/layouts/dashboard/DashboardHeader'
import DashboardSidebar from '@/layouts/dashboard/DashboardSidebar'

export default function DashboardLayout({ navItems }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      <DashboardSidebar
        navItems={navItems}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
