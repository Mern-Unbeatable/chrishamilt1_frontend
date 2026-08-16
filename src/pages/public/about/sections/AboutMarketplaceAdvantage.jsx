import { BadgeCheck, MapPin, ShieldCheck, User, Zap } from 'lucide-react'
import { DEMO_ABOUT_MARKETPLACE_ADVANTAGE } from '@/data/demoData'

const ADVANTAGE_ICONS = {
  verified: User,
  speed: Zap,
  clarity: ShieldCheck,
  uk: MapPin,
}

export default function AboutMarketplaceAdvantage() {
  return (
    <section
      data-scroll-section
      className="py-16 lg:py-20"
      style={{
        background:
          'radial-gradient(ellipse 120% 100% at 50% 0%, #1A3A7A 0%, #152347 55%, #0F1D3A 100%)',
      }}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div data-scroll-header className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white sm:text-[11px]">
            <span className="flex size-4 items-center justify-center rounded-full border border-white/40">
              <BadgeCheck className="size-2.5" strokeWidth={2.5} />
            </span>
            Marketplace Advantage
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
            Why Thousands Choose Our Platform
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#94A3B8] sm:text-lg">
            Designed from the ground up to restore confidence and quality in home improvement
            services.
          </p>
        </div>

        <div className="mx-auto mt-12 grid container grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_ABOUT_MARKETPLACE_ADVANTAGE.map((item) => {
            const Icon = ADVANTAGE_ICONS[item.id]

            return (
              <article
                key={item.id}
                data-scroll-item
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-[2px] sm:p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6] text-white shadow-[0_8px_20px_-10px_rgba(59,130,246,0.8)]">
                    <Icon className="size-5" strokeWidth={2} />
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/70 sm:text-[10px]">
                    {item.tag}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#94A3B8]">{item.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
