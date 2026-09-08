import { useEffect, useMemo, useState } from 'react'
import { Coins, PoundSterling, TrendingUp, Upload, Wallet } from 'lucide-react'
import WalletStatCard from '@/components/data-display/WalletStatCard/WalletStatCard'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import TradesmanRevenueChart from '@/pages/tradesman/earnings/sections/TradesmanRevenueChart'
import TradesmanEarningsRecentList from '@/pages/tradesman/earnings/sections/TradesmanEarningsRecentList'
import {
  fetchTradesmanEarnings,
  getDemoTradesmanEarningsPage,
  isTradesmanEarningsApiEnabled,
} from '@/services/tradesmanEarningsApi'

const EARNINGS_ICONS = {
  wallet: Wallet,
  trend: TrendingUp,
  coins: Coins,
  pound: PoundSterling,
}

export default function TradesmanEarningsPage() {
  const useApi = isTradesmanEarningsApiEnabled()
  const demoData = useMemo(() => getDemoTradesmanEarningsPage(), [])

  const [summaryStats, setSummaryStats] = useState(demoData.summaryStats)
  const [revenueSummary, setRevenueSummary] = useState(demoData.revenueSummary)
  const [chartData, setChartData] = useState(demoData.chartData)
  const [recentItems, setRecentItems] = useState(demoData.recentItems)
  const [payoutNote, setPayoutNote] = useState(demoData.payoutNote)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    async function loadEarnings() {
      setLoading(true)
      setError('')

      try {
        const result = await fetchTradesmanEarnings()
        if (cancelled) return

        setSummaryStats(result.summaryStats)
        setRevenueSummary(result.revenueSummary)
        setChartData(result.chartData)
        setRecentItems(result.recentItems)
        setPayoutNote(result.payoutNote)
      } catch (err) {
        if (cancelled) return
        setError(err?.message || 'Unable to load earnings right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadEarnings()

    return () => {
      cancelled = true
    }
  }, [useApi])

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Earnings"
        description={loading ? 'Loading earnings…' : payoutNote}
       
      />

      {error ? (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-8 text-center">
          <p className="text-sm font-semibold text-[#B91C1C]">{error}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
          <p className="text-sm text-[#64748B]">Loading earnings…</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summaryStats.map((stat) => (
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

          <TradesmanRevenueChart
            chartData={chartData}
            revenueSummary={revenueSummary}
          />

          <TradesmanEarningsRecentList items={recentItems} />
        </>
      )}
    </div>
  )
}
