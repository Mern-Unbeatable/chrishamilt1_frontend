import { Award, Briefcase, MapPin, Users } from 'lucide-react'

const METRICS = [
  {
    icon: Briefcase,
    iconClassName: 'bg-[#EFF6FF] text-[#2563EB]',
    value: '50,000+',
    label: 'Jobs Posted',
    description: 'Homeowners satisfied across the UK',
  },
  {
    icon: Users,
    iconClassName: 'bg-[#ECFDF5] text-[#059669]',
    value: '15,000+',
    label: 'Verified Tradesmen',
    description: 'Gas Safe, NICEIC & ID Vetted',
  },
  {
    icon: MapPin,
    iconClassName: 'bg-[#EFF6FF] text-[#0284C7]',
    value: '250+',
    label: 'UK Cities Covered',
    description: 'From London to Edinburgh',
  },
  {
    icon: Award,
    iconClassName: 'bg-[#FFF7ED] text-[#EA580C]',
    value: '98%',
    label: 'Customer Satisfaction',
    description: 'Based on verified review feedback',
  },
]

export default function MarketplaceMetrics() {
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
          {METRICS.map((metric) => {
            const Icon = metric.icon

            return (
              <article
                key={metric.label}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-6"
              >
                <div
                  className={`mb-5 flex size-10 items-center justify-center rounded-lg ${metric.iconClassName}`}
                >
                  <Icon className="size-5" strokeWidth={2} />
                </div>
                <p className="text-lg font-semibold text-[#111827]">
                  <span className="font-bold">{metric.value}</span> {metric.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  {metric.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
