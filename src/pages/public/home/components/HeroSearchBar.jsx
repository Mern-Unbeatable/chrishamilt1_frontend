import HeroCategorySelect from '@/pages/public/home/components/HeroCategorySelect'
import HeroLocationInput from '@/pages/public/home/components/HeroLocationInput'

export default function HeroSearchBar() {
  return (
    <div className="mt-10 w-full max-w-[760px] rounded-full border border-[#E5E7EB] bg-white p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)]">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
        <HeroCategorySelect />
        <div className="hidden h-8 w-px shrink-0 bg-[#E5E7EB] sm:block" />
        <HeroLocationInput />
        <button
          type="button"
          className="mx-1 h-11 shrink-0 rounded-full bg-btn-primary px-8 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
        >
          Browse
        </button>
      </div>
    </div>
  )
}
