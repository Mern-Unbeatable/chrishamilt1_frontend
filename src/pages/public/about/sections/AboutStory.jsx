import {
  BadgeCheck,
  BookOpen,
  Check,
  Flame,
  Home,
  Network,
  PanelsTopLeft,
  Zap,
} from 'lucide-react'
import { DEMO_ABOUT_STORY, DEMO_ABOUT_TRADES } from '@/data/demoData'

const TRADE_ICONS = {
  plumbing: Flame,
  electrical: Zap,
  roofing: Home,
  building: PanelsTopLeft,
}

export default function AboutStory() {
  return (
    <section data-scroll-section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <article
            data-scroll-item
            className="overflow-hidden rounded-[32px] p-6 text-white shadow-[0_24px_60px_-24px_rgba(1,96,242,0.45)] sm:p-8 lg:p-9"
            style={{
              background:
                'linear-gradient(135deg, #0160F2 0%, #0B4FD4 48%, #1A2B5F 100%)',
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white sm:text-[11px]">
              <Network className="size-3.5" strokeWidth={2.25} />
              The UK Trade Revolution
            </div>

            <h2 className="mt-5 max-w-[420px] text-[1.7rem] font-bold leading-[1.15] sm:text-[1.9rem] lg:text-[2rem]">
              Built for UK Homeowners &amp; Skilled Professionals
            </h2>

            <p className="mt-4 max-w-[430px] text-sm leading-7 text-white/85 sm:text-[15px]">
              Eliminating fake leads, high monthly subscriptions, and unverified profiles by
              establishing a transparent marketplace grounded in trust and quality.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {DEMO_ABOUT_TRADES.map((trade) => {
                const Icon = TRADE_ICONS[trade.id]

                return (
                  <div
                    key={trade.id}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#014BB8]/45 px-4 py-3.5"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/12">
                      <Icon className="size-4" strokeWidth={2} />
                    </span>
                    <span className="text-sm font-medium leading-snug">{trade.label}</span>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white sm:text-[11px]">
                <span className="flex size-6 items-center justify-center rounded-full bg-[#0160F2] ring-2 ring-white/20">
                  <BadgeCheck className="size-3.5 text-white" strokeWidth={2.5} />
                </span>
                Verified UK Standards
              </span>
              <span className="text-xs font-medium text-white/90 sm:text-sm">
                100% Free for Customers
              </span>
            </div>
          </article>

          <div data-scroll-item className="lg:pt-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EFF6FF] px-4 py-1.5 text-xs font-semibold text-btn-primary sm:text-sm">
              <BookOpen className="size-3.5 sm:size-4" strokeWidth={2.25} />
              About Our Journey
            </div>

            <h2 className="mt-5 text-[2rem] font-bold tracking-[-0.02em] text-[#111827] sm:text-[2.35rem]">
              Our Story
            </h2>

            <p className="mt-5 text-base font-semibold leading-7 text-[#374151] sm:text-[17px] sm:leading-8">
              {DEMO_ABOUT_STORY.intro}
            </p>
            <p className="mt-4 text-[15px] leading-7 text-[#757575] sm:text-base font-medium">
              {DEMO_ABOUT_STORY.body}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {DEMO_ABOUT_STORY.highlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl bg-[#EFF6FF] p-5 sm:p-[18px]"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-btn-primary text-white">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#111827]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#64748B]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
