import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import StatusBadge from '@/components/data-display/DataTable/StatusBadge'
import TokenPricingCard from '@/components/data-display/TokenPricingCard/TokenPricingCard'
import WalletStatCard from '@/components/data-display/WalletStatCard/WalletStatCard'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import {
  confirmTokenPackageCheckout,
  fetchTokenPackages,
  fetchTradesmanPurchases,
  fetchTradesmanWallet,
  getDemoTokenPackages,
  getDemoWalletStats,
  isTradesmanWalletApiEnabled,
  startTokenPackageCheckout,
} from '@/services/tradesmanWalletApi'

export default function TradesmanWalletPage() {
  const useApi = isTradesmanWalletApiEnabled()
  const [searchParams, setSearchParams] = useSearchParams()

  const [walletStats, setWalletStats] = useState(getDemoWalletStats())
  const [packages, setPackages] = useState(getDemoTokenPackages())
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [checkoutPackageId, setCheckoutPackageId] = useState('')

  const loadWallet = useCallback(async () => {
    if (!useApi) return

    setLoading(true)
    setError('')

    try {
      const [stats, plans, history] = await Promise.all([
        fetchTradesmanWallet(),
        fetchTokenPackages(),
        fetchTradesmanPurchases(),
      ])

      setWalletStats(stats)
      setPackages(plans)
      setPurchases(history)
    } catch (err) {
      setWalletStats([])
      setPackages([])
      setPurchases([])
      setError(err?.message || 'Unable to load wallet data right now.')
    } finally {
      setLoading(false)
    }
  }, [useApi])

  useEffect(() => {
    if (!useApi) return undefined

    loadWallet()
    return undefined
  }, [loadWallet, useApi])

  useEffect(() => {
    if (!useApi) return undefined

    const status = searchParams.get('status')
    const sessionId = searchParams.get('session_id')

    if (!status && !sessionId) return undefined

    let cancelled = false

    async function handleReturnFromCheckout() {
      if (status === 'cancelled') {
        setNotice('Checkout was cancelled. No tokens were charged.')
        setSearchParams({}, { replace: true })
        return
      }

      if (status === 'success' || sessionId) {
        try {
          if (sessionId) {
            await confirmTokenPackageCheckout(sessionId)
          }
          if (!cancelled) {
            setNotice('Payment successful. Your wallet has been updated.')
            await loadWallet()
          }
        } catch (err) {
          if (!cancelled) {
            setError(err?.message || 'Payment confirmation failed. Contact support if tokens are missing.')
          }
        } finally {
          if (!cancelled) {
            setSearchParams({}, { replace: true })
          }
        }
      }
    }

    handleReturnFromCheckout()

    return () => {
      cancelled = true
    }
  }, [loadWallet, searchParams, setSearchParams, useApi])

  const handleBuyTokens = useCallback(
    async (plan) => {
      if (!useApi) return

      setCheckoutPackageId(plan.id)
      setError('')
      setNotice('')

      try {
        const checkout = await startTokenPackageCheckout(plan.id)
        window.location.assign(checkout.checkoutUrl)
      } catch (err) {
        setError(err?.message || 'Unable to start checkout.')
        setCheckoutPackageId('')
      }
    },
    [useApi],
  )

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Wallet & tokens"
        description={
          loading
            ? 'Loading wallet…'
            : 'Tokens are used to submit quotations. Unused tokens never expire.'
        }
      />

      {notice ? (
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-6 py-4">
          <p className="text-sm font-semibold text-[#166534]">{notice}</p>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-8 text-center">
          <p className="text-sm font-semibold text-[#B91C1C]">{error}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
          <p className="text-sm text-[#64748B]">Loading wallet…</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {walletStats.map((stat) => (
              <WalletStatCard key={stat.id} {...stat} />
            ))}
          </div>

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {packages.map((plan) => (
              <TokenPricingCard
                key={plan.id}
                {...plan}
                onBuyTokens={() => handleBuyTokens(plan)}
                buyLabel={checkoutPackageId === plan.id ? 'Redirecting…' : 'Buy Tokens'}
              />
            ))}
          </div>

          {useApi && purchases.length > 0 ? (
            <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
              <h2 className="text-base font-semibold text-[#111827]">Recent purchases</h2>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] text-xs uppercase tracking-wide text-[#64748B]">
                      <th className="px-2 py-3 font-semibold">Package</th>
                      <th className="px-2 py-3 font-semibold">Tokens</th>
                      <th className="px-2 py-3 font-semibold">Amount</th>
                      <th className="px-2 py-3 font-semibold">Status</th>
                      <th className="px-2 py-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase) => (
                      <tr key={purchase.id} className="border-b border-[#F1F5F9] last:border-0">
                        <td className="px-2 py-3 font-medium text-[#111827]">{purchase.packageName}</td>
                        <td className="px-2 py-3 text-[#64748B]">{purchase.tokens}</td>
                        <td className="px-2 py-3 text-[#64748B]">{purchase.amount}</td>
                        <td className="px-2 py-3">
                          <StatusBadge status={purchase.status} />
                        </td>
                        <td className="px-2 py-3 text-[#64748B]">{purchase.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}
