import MetricCard from '@/pages/public/home/components/MetricCard'
import { MARKETPLACE_METRICS } from '@/pages/public/home/components/marketplaceMetrics.constants'

export default function MarketplaceMetricsSection() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-btn-primary">
            Proven Marketplace Metrics
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            Trusted by Thousands Across the United Kingdom
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MARKETPLACE_METRICS.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </div>
    </section>
  )
}
