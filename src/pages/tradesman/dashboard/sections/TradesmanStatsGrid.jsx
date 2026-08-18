import {
  Building2,
  CheckCircle2,
  Coins,
  FileText,
  MessageSquare,
  Star,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import WalletStatCard from '@/components/data-display/WalletStatCard/WalletStatCard'
import { DEMO_TRADESMAN_DASHBOARD_STATS } from '@/data/tradesmanDashboardData'

const STAT_ICONS = {
  coins: Coins,
  file: FileText,
  check: CheckCircle2,
  checkCircle: CheckCircle2,
  building: Building2,
  wallet: Wallet,
  trend: TrendingUp,
  star: Star,
  message: MessageSquare,
}

export default function TradesmanStatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {DEMO_TRADESMAN_DASHBOARD_STATS.map((stat) => (
        <WalletStatCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          icon={STAT_ICONS[stat.iconKey]}
          iconTone={stat.iconTone}
        />
      ))}
    </div>
  )
}
