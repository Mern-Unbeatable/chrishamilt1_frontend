import {
  BadgeCheck,
  MessageSquare,
  Shield,
  Star,
  Target,
  Zap,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    title: 'Verified Professionals',
    description:
      'Every tradesman undergoes mandatory photo ID, Public Liability Insurance (£2M+), and trade accreditation audits (Gas Safe, NICEIC, NFRC).',
  },
  {
    icon: Target,
    title: 'Quality Job Leads',
    description:
      'Job leads are strictly capped at 3–4 tradesmen maximum. No lead flooding, ensuring higher conversion rates for quality tradespeople.',
  },
  {
    icon: MessageSquare,
    title: 'Secure In-App Messaging',
    description:
      'Communicate safely, share photos, floorplans, and agree on written milestone quotes without giving away personal phone numbers early.',
  },
  {
    icon: Star,
    title: '100% Transparent Reviews',
    description:
      'Only homeowners who hired through Traders In Loop can leave feedback. No fake reviews, ensuring honest ratings you can rely on.',
  },
  {
    icon: BadgeCheck,
    title: 'Free Job Posting',
    description:
      'Homeowners can post jobs at no cost. Describe your project, receive quotes, and hire a verified tradesman with zero upfront fees.',
  },
  {
    icon: Zap,
    title: 'Fast Quote Matching',
    description:
      'Over 85% of posted jobs receive their first verified quote within 15–30 minutes from active tradesmen in your postcode area.',
  },
]

export default function WhyPreferTradeTrust() {
  return (
    <section data-scroll-section className="bg-secondary py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div data-scroll-header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            Why Homeowners & Tradesmen Prefer Traders In Loop
          </h2>
          <p className="mt-4 text-base leading-7 text-[#64748B] sm:text-lg">
            A premium alternative to traditional directories. We prioritize verified
            trade quality, fair lead pricing, and total transparency.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                data-scroll-item
                className="flex h-full flex-col rounded-xl border border-[#E5E7EB] bg-white p-8"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-[#EAF2FE] text-btn-primary">
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-[#111827]">{feature.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-[#64748B]">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
