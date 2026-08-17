import TokenPricingCard from '@/components/data-display/TokenPricingCard/TokenPricingCard'
import WalletStatCard from '@/components/data-display/WalletStatCard/WalletStatCard'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import { DEMO_TOKEN_PRICING, DEMO_WALLET_STATS } from '@/data/demoData'

export default function TradesmanWalletPage() {
  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Wallet & tokens"
        description="Tokens are used to submit quotations. Unused tokens never expire."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_WALLET_STATS.map((stat) => (
          <WalletStatCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 max-w-7xl mx-auto">
        {DEMO_TOKEN_PRICING.map((plan) => (
          <TokenPricingCard
            key={plan.id}
            {...plan}
            onBuyTokens={() => {}}
          />
        ))}
      </div>
    </div>
  )
}
