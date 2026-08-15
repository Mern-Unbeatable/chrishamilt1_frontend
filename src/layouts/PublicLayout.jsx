import { Outlet } from 'react-router'
import PublicNavbar from '@/layouts/PublicNavbar'
import Footer from '@/layouts/Footer'
import ScrollToTop from '@/components/ScrollToTop'

export default function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <header>
        <PublicNavbar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  )
}
