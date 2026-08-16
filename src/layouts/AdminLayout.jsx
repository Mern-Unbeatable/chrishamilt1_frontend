import DashboardLayout from '@/layouts/dashboard/DashboardLayout'
import { ADMIN_NAV } from '@/layouts/dashboard/navConfig'

export default function AdminLayout() {
  return <DashboardLayout navItems={ADMIN_NAV} />
}
