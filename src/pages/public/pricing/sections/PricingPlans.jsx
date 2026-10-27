import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { BadgeCheck } from 'lucide-react'
import TokenPricingCard from '@/components/data-display/TokenPricingCard/TokenPricingCard'
import { DEMO_TOKEN_PRICING } from '@/data/demoData'
import { useAuth } from '@/auth/AuthProvider'
import {
  fetchTokenPackages,
  getDemoTokenPackages,
  isTradesmanWalletApiEnabled,
  startTokenPackageCheckout,
} from '@/services/tradesmanWalletApi'

export default function PricingPlans({
  onSelectPlan,
  buyLabel = 'Buy Tokens',
  checkoutPackageId = '',
}) {
  const navigate = useNavigate()
  const { isTradesman, isAuthenticated } = useAuth()
  const useApi = isTradesmanWalletApiEnabled()
  const [plans, setPlans] = useState(useApi ? [] : DEMO_TOKEN_PRICING)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')
  const [activeCheckoutId, setActiveCheckoutId] = useState('')

  const currentCheckoutId = checkoutPackageId || activeCheckoutId

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
        setPlans(packages)
      } catch (err) {
        if (cancelled) return
        setPlans([])
        setError(err?.message || 'Unable to load token packages right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadPackages()

    return () => {
      cancelled = true
    }
  }, [useApi])

  const handleBuy = async (plan) => {
    if (onSelectPlan) {
      onSelectPlan(plan)
      return
    }

    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: '/pricing', packageId: plan.id } })
      return
    }

    if (!isTradesman) {
      setError('Token packages can only be purchased by tradesman accounts to unlock job leads.')
      return
    }

    if (!useApi) {
      navigate('/tradesman/wallet')
      return
    }

    setActiveCheckoutId(plan.id)
    setError('')
    try {
      const checkout = await startTokenPackageCheckout(plan.id)
      if (checkout?.checkoutUrl) {
        window.location.assign(checkout.checkoutUrl)
      } else {
        throw new Error('Unable to start checkout.')
      }
    } catch (err) {
      setError(err?.message || 'Unable to start checkout. Please try again.')
      setActiveCheckoutId('')
    }
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
        ) : !plans.length && !error ? (
          <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-6 py-16 text-center">
            <p className="text-sm text-[#64748B]">No token packages are available right now.</p>
          </div>
        ) : (
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 pt-4 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-8">
            {plans.map((plan) => (
              <div key={plan.id} data-scroll-item>
                <TokenPricingCard
                  {...plan}
                  buyLabel={
                    currentCheckoutId === plan.id ? 'Redirecting…' : buyLabel
                  }
                  onBuyTokens={
                    currentCheckoutId && currentCheckoutId !== plan.id
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
