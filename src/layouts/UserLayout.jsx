import { DashboardContent, DashboardShell } from '@/layouts/DashboardSidebar'

const userNavItems = [
  { label: 'Dashboard', to: '/user/dashboard', end: true },
  { label: 'Bookings', to: '/user/bookings' },
  { label: 'Messages', to: '/user/messages' },
  { label: 'Profile', to: '/user/profile' },
]

export default function UserLayout() {
  return (
    <DashboardShell title="User Portal" navItems={userNavItems}>
      <DashboardContent />
    </DashboardShell>
  )
}
