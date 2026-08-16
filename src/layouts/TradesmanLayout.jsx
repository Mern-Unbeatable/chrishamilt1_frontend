import DashboardLayout from '@/layouts/dashboard/DashboardLayout'
import { TRADESMAN_NAV } from '@/layouts/dashboard/navConfig'

export default function TradesmanLayout() {
  return <DashboardLayout navItems={TRADESMAN_NAV} />
}
