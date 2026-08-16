import { BadgeCheck, ChevronDown, SlidersHorizontal } from 'lucide-react'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@/components/Dropdown'
import {
  DEMO_BROWSE_BUDGETS,
  DEMO_BROWSE_JOB_CATEGORIES,
} from '@/data/demoData'

export default function BrowseJobsHero({
  category,
  onCategoryChange,
  location,
  onLocationChange,
  budget,
  onBudgetChange,
  filteredCount,
}) {
  return (
    <section
      data-scroll-hero
      className="relative -mt-[72px] min-h-[520px] pb-10 pt-[72px] lg:min-h-[640px] lg:pb-12"
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
            <BadgeCheck className="size-3.5 text-btn-primary sm:size-4" strokeWidth={2.25} />
            UK&apos;s Trusted Trade Lead Marketplace
          </div>

          <h1
            data-scroll-hero-item
            className="mt-6 text-[2rem] font-bold leading-tight tracking-[-0.02em] text-[#111827] sm:mt-8 sm:text-[2.75rem] lg:text-5xl"
          >
            Find Jobs{' '}
            <span className="text-btn-primary">That Match</span> <br /> Your Skills
          </h1>

          <p
            data-scroll-hero-item
            className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-[#4B5563] sm:mt-6 sm:text-base lg:text-lg"
          >
            Browse available jobs posted by customers across the UK. Filter by trade,
            location, budget, and urgency to quickly find the right opportunities.
          </p>
        </div>

        <div
          data-scroll-hero-item
          className="relative z-10 mx-auto mt-8 max-w-5xl overflow-visible rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.08)] sm:p-6 lg:mt-10 lg:p-8"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[#111827]">
              <SlidersHorizontal className="size-5 text-btn-primary" strokeWidth={2} />
              <p className="text-base font-semibold sm:text-lg">Filter Job Opportunities</p>
            </div>
            <p className="text-sm text-[#64748B]">
              Showing{' '}
              <span className="font-semibold text-[#111827]">{filteredCount}</span> jobs
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 overflow-visible md:grid-cols-3">
            <div className="relative space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                Trade Category
              </label>
              <Dropdown className="w-full">
                <DropdownTrigger className="h-12 w-full justify-between rounded-lg border-[#E5E7EB] px-4 text-[#111827] shadow-none hover:bg-[#F8FAFC]">
                  <span className="truncate">{category}</span>
                  <ChevronDown className="size-4 shrink-0 text-[#94A3B8]" />
                </DropdownTrigger>
                <DropdownMenu className="w-full">
                  {DEMO_BROWSE_JOB_CATEGORIES.map((item) => (
                    <DropdownItem key={item} onClick={() => onCategoryChange(item)}>
                      {item}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="browse-location"
                className="block text-xs font-semibold uppercase tracking-wide text-[#94A3B8]"
              >
                Location
              </label>
              <input
                id="browse-location"
                type="text"
                value={location}
                onChange={(event) => onLocationChange(event.target.value)}
                placeholder="Location"
                className="h-12 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
              />
            </div>

            <div className="relative space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                Budget Range
              </label>
              <Dropdown className="w-full">
                <DropdownTrigger className="h-12 w-full justify-between rounded-lg border-[#E5E7EB] px-4 text-[#111827] shadow-none hover:bg-[#F8FAFC]">
                  <span className="truncate">{budget}</span>
                  <ChevronDown className="size-4 shrink-0 text-[#94A3B8]" />
                </DropdownTrigger>
                <DropdownMenu className="w-full">
                  {DEMO_BROWSE_BUDGETS.map((item) => (
                    <DropdownItem key={item} onClick={() => onBudgetChange(item)}>
                      {item}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
