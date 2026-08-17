import { Coins, PoundSterling, TrendingUp, Upload, Wallet } from 'lucide-react'
import WalletStatCard from '@/components/data-display/WalletStatCard/WalletStatCard'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import { DEMO_TRADESMAN_EARNINGS_SUMMARY } from '@/data/tradesmanEarningsData'
import TradesmanRevenueChart from '@/pages/tradesman/earnings/sections/TradesmanRevenueChart'

const EARNINGS_ICONS = {
  wallet: Wallet,
  trend: TrendingUp,
  coins: Coins,
  pound: PoundSterling,
}

export default function TradesmanEarningsPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Earnings"
        description="Payouts land 2 working days after customer approval"
        actions={
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#F8FAFC]"
          >
            <Upload className="size-4 shrink-0" strokeWidth={1.75} />
            Export
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEMO_TRADESMAN_EARNINGS_SUMMARY.map((stat) => (
          <WalletStatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            subtext={stat.subtext}
            subtextClassName={stat.subtextClassName}
            icon={EARNINGS_ICONS[stat.iconKey]}
            iconTone={stat.iconTone}
          />
        ))}
      </div>

      <TradesmanRevenueChart />
    </div>
  )
}
