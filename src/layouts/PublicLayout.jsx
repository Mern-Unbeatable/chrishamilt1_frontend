import { Outlet } from 'react-router'
import PublicNavbar from '@/layouts/PublicNavbar'
import Footer from '@/layouts/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import ScrollAnimationProvider from '@/components/animations/ScrollAnimationProvider'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <header className="fixed inset-x-0 top-0 z-50">
        <PublicNavbar />
      </header>
      <main className="flex-1 pt-[72px]">
        <ScrollAnimationProvider>
          <Outlet />
        </ScrollAnimationProvider>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}
