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
      className="relative -mt-[72px] min-h-[852px] overflow-hidden pt-[72px]"
      style={{
        background:
          'linear-gradient(180deg, #EAF2FE 0%, #F4F8FE 42%, #FAFCFF 68%, #FFFFFF 100%)',
      }}
    >
      <img
        src={leftHero}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 bottom-0 z-0 hidden h-[500px] w-auto select-none object-contain object-bottom mix-blend-multiply lg:block xl:h-[560px]"
      />
      <img
        src={rightHero}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 bottom-0 z-0 hidden h-[500px] w-auto select-none object-contain object-bottom mix-blend-multiply lg:block xl:h-[560px]"
      />

      <div className="container relative z-10 mx-auto flex max-w-[920px] flex-col items-center px-6 pb-24 pt-16 text-center lg:px-8 lg:pt-20">
        <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-[#E5E7EB] bg-white px-5 py-2 text-sm text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <span>The #1 Rated UK Trades Marketplace</span>
          <span className="hidden text-[#D1D5DB] sm:inline">|</span>
          <span className="hidden sm:inline">🇬🇧 Direct UK Verification</span>
          <span className="hidden text-[#D1D5DB] md:inline">|</span>
          <Link to="/how-it-works" className="font-medium text-btn-primary hover:underline">
            Learn more
          </Link>
        </div>

        <h1 className="mt-12 max-w-[820px] text-[2.5rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#111827] sm:text-[3.25rem]">
          Find Trusted Local Tradesmen for Any Job
        </h1>
        <p className="mt-6 max-w-[680px] text-base leading-7 text-[#4B5563] sm:text-lg">
          Post your job for free and get competitive quotes from Gas Safe, NICEIC,
          and ID-verified local UK tradesmen. Tradesmen connect directly with
          quality leads and grow their business.
        </p>

        <div className="mt-10 w-full max-w-[760px] rounded-full border border-[#E5E7EB] bg-white p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <Dropdown className="w-full sm:min-w-[240px] sm:max-w-[280px]">
              <DropdownTrigger className="h-12 w-full justify-between gap-3 rounded-full border-0 bg-transparent px-4 shadow-none hover:bg-[#F8FAFC]">
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
              <DropdownMenu className="left-0 w-full min-w-[240px]">
                {HERO_CATEGORIES.map((item) => (
                  <DropdownItem key={item} onClick={() => setCategory(item)}>
                    {item}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <div className="hidden h-8 w-px shrink-0 bg-[#E5E7EB] sm:block" />

            <div className="flex h-12 min-w-0 flex-1 items-center gap-3 px-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-btn-primary">
                <MapPin className="size-4" strokeWidth={2.25} />
              </span>
              <input
                type="text"
                placeholder="Your location"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#111827] outline-none placeholder:font-normal placeholder:text-[#94A3B8]"
              />
              <ChevronDown className="size-4 shrink-0 text-[#94A3B8]" />
            </div>

            <button
              type="button"
              className="mx-1 h-11 shrink-0 rounded-full bg-btn-primary px-8 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
            >
              Browse
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
