import { Link } from 'react-router'
import { BadgeCheck } from 'lucide-react'

export default function AboutHero() {
  return (
    <section
      data-scroll-hero
      className="relative -mt-[72px] pb-14 pt-[72px] lg:pb-16"
      style={{
        background:
          'linear-gradient(180deg, #EAF2FE 0%, #F4F8FE 42%, #FAFCFF 68%, #FFFFFF 100%)',
      }}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-[760px] pt-10 text-center sm:pt-14 lg:pt-16">
          <div
            data-scroll-hero-item
            className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-0.5 text-xs text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:px-4 sm:py-1.5 sm:text-sm"
          >
            <BadgeCheck className="size-3.5 text-btn-primary sm:size-4" strokeWidth={2.25} />
            Verified UK Tradesmen &amp; Homeowner Marketplace
          </div>

          <h1
            data-scroll-hero-item
            className="mt-7 text-[2rem] font-bold leading-[1.12] tracking-[-0.02em] text-[#111827] sm:mt-8 sm:text-[2.65rem] lg:text-[3rem]"
          >
            Connecting Customers with
            <br />
            <span className="text-btn-primary">Trusted Tradesmen</span> Across the UK
          </h1>

          <p
            data-scroll-hero-item
            className="mx-auto mt-5 max-w-[640px] text-sm leading-7 text-[#64748B] sm:mt-6 sm:text-base"
          >
            We&apos;re building a smarter way for homeowners and businesses to find verified
            tradesmen while helping skilled professionals connect with genuine job
            opportunities—all through one trusted marketplace.
          </p>

          <div
            data-scroll-hero-item
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <Link
              to="/auth/signup"
              className="inline-flex min-w-[168px] items-center justify-center rounded-full bg-btn-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
            >
              Post a Job
            </Link>
            <Link
              to="/jobs"
              className="inline-flex min-w-[168px] items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-8 py-3 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#F8FAFC]"
            >
              Browse Tradesmen
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
