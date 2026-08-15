import { DashboardContent, DashboardShell } from '@/layouts/DashboardSidebar'

const adminNavItems = [
  { label: 'Dashboard', to: '/admin/dashboard', end: true },
  { label: 'Users', to: '/admin/users' },
  { label: 'Tradesmen', to: '/admin/tradesmen' },
  { label: 'Settings', to: '/admin/settings' },
]

export default function AdminLayout() {
  return (
    <DashboardShell title="Admin Portal" navItems={adminNavItems}>
      <DashboardContent />
    </DashboardShell>
  )
}
