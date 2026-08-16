import { Link } from 'react-router'
import {
  ArrowRight,
  Coins,
  CreditCard,
  MessageSquare,
  Shield,
  Star,
  Target,
} from 'lucide-react'
import { DEMO_ABOUT_PLATFORM_FEATURES } from '@/data/demoData'

const FEATURE_ICONS = {
  verified: Shield,
  leads: Target,
  messaging: MessageSquare,
  tokens: Coins,
  payments: CreditCard,
  reviews: Star,
}

export default function AboutPlatformFeatures() {
  return (
    <section data-scroll-section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div data-scroll-header className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full bg-[#EAF2FE] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-btn-primary">
            Platform Features
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            Everything You Need in One Platform
          </h2>
          <p className="mt-4 text-base leading-7 text-[#64748B] sm:text-lg">
            A complete ecosystem designed to make home trade projects seamless, fair, and
            reliable.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DEMO_ABOUT_PLATFORM_FEATURES.map((feature) => {
            const Icon = FEATURE_ICONS[feature.id]

            return (
              <article
                key={feature.id}
                data-scroll-item
                className="flex h-full flex-col rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)]"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[#EAF2FE] text-btn-primary">
                  <Icon className="size-5" strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#111827]">{feature.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-[#64748B]">
                  {feature.description}
                </p>
                <Link
                  to={feature.to}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-btn-primary transition-colors hover:text-[#0150CC]"
                >
                  Learn more
                  <ArrowRight className="size-4" strokeWidth={2.25} />
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
