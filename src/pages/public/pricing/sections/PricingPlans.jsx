import { useNavigate } from 'react-router'
import { BadgeCheck } from 'lucide-react'
import TokenPricingCard from '@/components/data-display/TokenPricingCard/TokenPricingCard'
import { DEMO_TOKEN_PRICING } from '@/data/demoData'

export default function PricingPlans({ onSelectPlan }) {
  const navigate = useNavigate()

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
            Purchase tokens to unlock customer job leads. The more tokens you buy, the
            better the value.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 pt-4 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-8">
          {DEMO_TOKEN_PRICING.map((plan) => (
            <div key={plan.id} data-scroll-item>
              <TokenPricingCard
                {...plan}
                onBuyTokens={() => handleBuy(plan)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
