import { ShieldCheck } from 'lucide-react'

export default function PricingHero() {
  return (
    <section
      data-scroll-hero
      className="relative -mt-[72px] min-h-[420px] pb-10 pt-[72px] lg:min-h-[480px] lg:pb-12"
      style={{
        background:
          'linear-gradient(180deg, #EAF2FE 0%, #F4F8FE 42%, #FAFCFF 68%, #FFFFFF 100%)',
      }}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-3xl pt-8 text-center sm:pt-12 lg:pt-16">
          <div
            data-scroll-hero-item
            className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-[#E5E7EB] bg-white px-4 py-0.5 text-xs text-gray-550 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:px-4 sm:py-1.5 sm:text-sm sm:text-[#64748B]"
          >
            <ShieldCheck className="size-3.5 text-btn-primary sm:size-4" strokeWidth={2.25} />
            UK Tradesman Lead Network
          </div>

          <h1
            data-scroll-hero-item
            className="mt-6 text-[2rem] font-bold leading-tight tracking-[-0.02em] text-[#111827] sm:mt-8 sm:text-[2.75rem] lg:text-5xl"
          >
            Simple, Transparent{' '}
            <span className="text-btn-primary">Pricing</span>
          </h1>

          <p
            data-scroll-hero-item
            className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-[#4B5563] sm:mt-6 sm:text-base lg:text-lg"
          >
            Purchase tokens to unlock quality job leads across the UK. No monthly
            subscriptions, no hidden fees—pay only for the opportunities you choose.
          </p>
        </div>
      </div>
    </section>
  )
}
