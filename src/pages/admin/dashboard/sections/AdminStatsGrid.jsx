import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Coins,
  FileText,
  FolderOpen,
  PoundSterling,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'
import WalletStatCard from '@/components/data-display/WalletStatCard/WalletStatCard'
import { DEMO_ADMIN_DASHBOARD_STATS } from '@/data/adminDashboardData'

const STAT_ICONS = {
  users: Users,
  briefcase: Briefcase,
  userCheck: UserCheck,
  alert: AlertTriangle,
  clipboard: ClipboardList,
  folder: FolderOpen,
  check: CheckCircle2,
  file: FileText,
  pound: PoundSterling,
  trend: TrendingUp,
  coins: Coins,
  coinsUsed: Coins,
}

export default function AdminStatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {DEMO_ADMIN_DASHBOARD_STATS.map((stat) => (
        <WalletStatCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          icon={STAT_ICONS[stat.iconKey]}
          iconTone={stat.iconTone}
          uppercaseLabel
        />
      ))}
    </div>
  )
}
