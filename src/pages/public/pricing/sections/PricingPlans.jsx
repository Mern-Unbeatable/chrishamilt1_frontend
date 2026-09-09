import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { BadgeCheck } from 'lucide-react'
import TokenPricingCard from '@/components/data-display/TokenPricingCard/TokenPricingCard'
import { DEMO_TOKEN_PRICING } from '@/data/demoData'
import {
  fetchTokenPackages,
  getDemoTokenPackages,
  isTradesmanWalletApiEnabled,
} from '@/services/tradesmanWalletApi'

export default function PricingPlans({
  onSelectPlan,
  buyLabel = 'Buy Tokens',
  checkoutPackageId = '',
}) {
  const navigate = useNavigate()
  const useApi = isTradesmanWalletApiEnabled()
  const [plans, setPlans] = useState(useApi ? [] : DEMO_TOKEN_PRICING)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!useApi) {
      setPlans(getDemoTokenPackages())
      setLoading(false)
      setError('')
      return undefined
    }

    let cancelled = false

    async function loadPackages() {
      setLoading(true)
      setError('')

      try {
        const packages = await fetchTokenPackages()
        if (cancelled) return
        setPlans(packages.length ? packages : getDemoTokenPackages())
      } catch (err) {
        if (cancelled) return
        setPlans(getDemoTokenPackages())
        setError(err?.message || 'Unable to load live packages. Showing demo plans.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadPackages()

    return () => {
      cancelled = true
    }
  }, [useApi])

  const handleBuy = (plan) => {
    if (onSelectPlan) {
      onSelectPlan(plan)
      return
    }

    navigate('/auth/signup')
  }

  return (
    <section data-scroll-section className="bg-white pb-16 lg:pb-20 ">
      <div className="container mx-auto px-6 lg:px-8">
        <div data-scroll-header className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-btn-primary px-4 py-1.5 text-xs font-semibold text-white sm:text-sm">
            <BadgeCheck className="size-4" strokeWidth={2.25} />
            Token Packages
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            Choose Your Token Package
          </h2>
          <p className="mt-4 text-base leading-7 text-[#64748B]">
            Choose the package that fits your business and get more value with larger token bundles.
          </p>
        </div>

        {error ? (
          <p className="mx-auto mt-6 max-w-2xl rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-center text-sm text-[#92400E]">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-6 py-16 text-center">
            <p className="text-sm text-[#64748B]">Loading token packages…</p>
          </div>
        ) : (
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 pt-4 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-8">
            {plans.map((plan) => (
              <div key={plan.id} data-scroll-item>
                <TokenPricingCard
                  {...plan}
                  buyLabel={
                    checkoutPackageId === plan.id ? 'Redirecting…' : buyLabel
                  }
                  onBuyTokens={
                    checkoutPackageId && checkoutPackageId !== plan.id
                      ? undefined
                      : () => handleBuy(plan)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
