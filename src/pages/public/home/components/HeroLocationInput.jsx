import { ChevronDown, MapPin } from 'lucide-react'

export default function HeroLocationInput() {
  return (
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
  )
}
