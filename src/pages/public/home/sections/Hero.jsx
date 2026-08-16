import { useState } from 'react'
import { Link } from 'react-router'
import { ChevronDown, LayoutGrid, MapPin } from 'lucide-react'
import leftHero from '@/assets/lefthero.png'
import rightHero from '@/assets/righthero.png'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@/components/Dropdown'

const HERO_CATEGORIES = [
  'Heating & Gas',
  'Plumbing',
  'Electrical',
  'Building & Construction',
  'Kitchen & Bathroom',
  'Roofing',
]

export default function Hero() {
  const [category, setCategory] = useState(HERO_CATEGORIES[0])

  return (
    <section
      data-scroll-hero
      className="relative -mt-[72px] overflow-hidden pt-[72px] min-h-[560px] lg:min-h-[920px]"
      style={{
        background:
          'linear-gradient(180deg, #EAF2FE 0%, #F4F8FE 42%, #FAFCFF 68%, #FFFFFF 100%)',
      }}
    >
      <img
        src={leftHero}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 top-1/2 -translate-y-1/3 z-0 h-[320px] w-auto select-none object-contain mix-blend-multiply lg:top-auto lg:bottom-0 lg:translate-y-0 lg:h-[500px] xl:h-[560px]"
      />
      <img
        src={rightHero}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/3 z-0 h-[320px] w-auto select-none object-contain mix-blend-multiply lg:top-auto lg:bottom-0 lg:translate-y-0 lg:h-[500px] xl:h-[560px]"
      />

      <div
        className="pointer-events-none absolute inset-0 z-10 lg:hidden"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255,255,255,0.92) 40%, rgba(255,255,255,0.4) 75%, transparent 100%)',
        }}
      />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-48 bg-gradient-to-t from-white via-white/60 to-transparent" />

      <div className="container relative z-20 mx-auto flex max-w-[920px] flex-col items-center px-6 pb-16 pt-8 text-center sm:pt-14 lg:px-8 lg:pb-24 lg:pt-36">
        <div
          data-scroll-hero-item
          className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-[#E5E7EB] bg-white px-4 py-0.5 text-xs text-gray-550 sm:text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:px-4 sm:py-1.5 sm:text-sm"
        >
          <span>The #1 Rated UK Trades Marketplace</span>
          <span className="hidden text-[#D1D5DB] sm:inline">|</span>
          <span className="hidden sm:inline">🇬🇧 Direct UK Verification</span>

        </div>

        <h1
          data-scroll-hero-item
          className="mt-6 max-w-[820px] text-[2.5rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#111827] sm:mt-10 sm:text-[3.25rem] lg:text-[3.3rem]"
        >
          Find Trusted <br /> <span className="text-btn-primary">Local Tradesmen</span> for Any Job
        </h1>

        <p
          data-scroll-hero-item
          className="mt-5 max-w-[680px] text-sm font-medium leading-7 text-[#4B5563] sm:mt-6 sm:text-base lg:text-lg"
        >
          Post your job for free and get competitive quotes from Gas Safe, NICEIC,
          and ID-verified local UK tradesmen. Tradesmen connect directly with
          quality leads and grow their business.
        </p>

        <div data-scroll-hero-item className="mt-8 w-full max-w-[580px] sm:mt-10 sm:max-w-[620px]">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] sm:rounded-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:p-1.5">
              <Dropdown className="w-full sm:min-w-[190px] sm:max-w-[220px]">
                <DropdownTrigger className="h-14 w-full justify-between gap-3 rounded-none border-0 bg-transparent px-4 shadow-none hover:bg-[#F8FAFC] sm:h-12 sm:rounded-full">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-btn-primary">
                      <LayoutGrid className="size-4" strokeWidth={2.25} />
                    </span>
                    <span className="truncate text-sm font-medium text-[#111827]">
                      {category}
                    </span>
                  </span>
                  <ChevronDown className="size-4 shrink-0 text-[#94A3B8]" />
                </DropdownTrigger>
                <DropdownMenu className="w-full min-w-[240px]">
                  {HERO_CATEGORIES.map((item) => (
                    <DropdownItem key={item} onClick={() => setCategory(item)}>
                      {item}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              <div className="mx-4 h-px bg-[#E2E8F0] sm:mx-0 sm:h-8 sm:w-px sm:shrink-0 sm:bg-[#E5E7EB]" />

              <div className="flex min-h-[56px] min-w-0 flex-1 items-center gap-3 px-4 py-2 sm:h-12 sm:py-0">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-btn-primary">
                  <MapPin className="size-4" strokeWidth={2.25} />
                </span>
                <input
                  type="text"
                  placeholder="Your location"
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#111827] outline-none placeholder:font-normal placeholder:text-[#94A3B8]"
                />
              </div>

              <div className="mx-4 h-px bg-[#E2E8F0] sm:hidden" />

              <div className="p-3 sm:p-0">
                <button
                  type="button"
                  className="h-11 w-full rounded-xl bg-btn-primary text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] sm:mx-1 sm:w-auto sm:shrink-0 sm:rounded-full sm:px-6"
                >
                  Browse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}
