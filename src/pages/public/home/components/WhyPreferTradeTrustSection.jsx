import WhyPreferFeatureCard from '@/pages/public/home/components/WhyPreferFeatureCard'
import { WHY_PREFER_FEATURES } from '@/pages/public/home/components/whyPreferTradeTrust.constants'

export default function WhyPreferTradeTrustSection() {
  return (
    <section className="bg-[#F2F2F280] py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-btn-primary">
            Built for Trust & Higher Quality
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            Why Homeowners & Tradesmen Prefer TradeTrust
          </h2>
          <p className="mt-4 text-base leading-7 text-[#64748B] sm:text-lg">
            A premium alternative to traditional directories. We prioritize verified
            trade quality, fair lead pricing, and total transparency.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {WHY_PREFER_FEATURES.map((feature) => (
            <WhyPreferFeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
