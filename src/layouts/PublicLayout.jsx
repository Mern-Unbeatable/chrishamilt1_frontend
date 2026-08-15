import { Outlet } from 'react-router'
import PublicNavbar from '@/layouts/PublicNavbar'
import PublicFooter from '@/layouts/footer/PublicFooter'
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
        <PublicFooter />
      </footer>
    </>
  )
}
