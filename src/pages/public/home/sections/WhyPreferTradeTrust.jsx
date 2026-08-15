import {
  MessageSquare,
  Shield,
  Star,
  Target,
  Wand2,
  Zap,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    iconClassName: 'bg-[#EFF6FF] text-[#2563EB]',
    title: 'Verified Professionals',
    description:
      'Every tradesman undergoes mandatory photo ID, Public Liability Insurance (£2M+), and trade accreditation audits (Gas Safe, NICEIC, NFRC).',
  },
  {
    icon: Target,
    iconClassName: 'bg-[#ECFDF5] text-[#059669]',
    title: 'Quality Job Leads',
    description:
      'Job leads are strictly capped at 3–4 tradesmen maximum. No lead flooding, ensuring higher conversion rates for quality tradespeople.',
  },
  {
    icon: MessageSquare,
    iconClassName: 'bg-[#F5F3FF] text-[#7C3AED]',
    title: 'Secure In-App Messaging',
    description:
      'Communicate safely, share photos, floorplans, and agree on written milestone quotes without giving away personal phone numbers early.',
  },
  {
    icon: Star,
    iconClassName: 'bg-[#FEFCE8] text-[#CA8A04]',
    title: '100% Transparent Reviews',
    description:
      'Only homeowners who hired through TradeTrust can leave feedback. No fake reviews, ensuring honest ratings you can rely on.',
  },
  {
    icon: Wand2,
    iconClassName: 'bg-[#FDF2F8] text-[#DB2777]',
    title: 'Integrated AI Scoper',
    description:
      'Our UK AI assistant helps homeowners calculate realistic cost ranges, materials needed, and drafts detailed job briefs instantly.',
  },
  {
    icon: Zap,
    iconClassName: 'bg-[#FFF7ED] text-[#EA580C]',
    title: 'Fast Quote Matching',
    description:
      'Over 85% of posted jobs receive their first verified quote within 15–30 minutes from active tradesmen in your postcode area.',
  },
]

export default function WhyPreferTradeTrust() {
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
          {FEATURES.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-8"
              >
                <div
                  className={`mb-5 flex size-10 items-center justify-center rounded-lg ${feature.iconClassName}`}
                >
                  <Icon className="size-5" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-[#111827]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#64748B]">
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
