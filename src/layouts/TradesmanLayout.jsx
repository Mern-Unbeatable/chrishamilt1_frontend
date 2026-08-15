import { DashboardContent, DashboardShell } from '@/layouts/DashboardSidebar'

const tradesmanNavItems = [
  { label: 'Dashboard', to: '/tradesman/dashboard', end: true },
  { label: 'Jobs', to: '/tradesman/jobs' },
  { label: 'Messages', to: '/tradesman/messages' },
  { label: 'Schedule', to: '/tradesman/schedule' },
  { label: 'Profile', to: '/tradesman/profile' },
]

export default function TradesmanLayout() {
  return (
    <DashboardShell title="Tradesman Portal" navItems={tradesmanNavItems}>
      <DashboardContent />
    </DashboardShell>
  )
}
