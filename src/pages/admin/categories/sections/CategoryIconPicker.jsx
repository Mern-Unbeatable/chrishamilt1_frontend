import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import TradeIcon from '@/components/common/TradeIcon'
import { cn } from '@/helpers/cn'
import { TRADE_ICON_NAMES } from '@/data/tradeIconNames'
import { filterTradeIcons, formatIconLabel } from '@/lib/tradeIconUtils'

const POPULAR_ICON_NAMES = [
  'Droplets',
  'Zap',
  'Hammer',
  'Paintbrush',
  'Sparkles',
  'Leaf',
  'Wrench',
  'Grid2x2',
  'Flame',
  'Building2',
  'Sun',
  'Grid3x3',
  'Box',
  'Bath',
  'HardHat',
  'Truck',
]

const PAGE_SIZE = 100

export default function CategoryIconPicker({ value, onChange }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const isSearching = Boolean(query.trim())

  const searchResults = useMemo(
    () => (isSearching ? filterTradeIcons(TRADE_ICON_NAMES, query) : TRADE_ICON_NAMES),
    [isSearching, query],
  )

  const totalPages = Math.max(1, Math.ceil(searchResults.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [query])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const visibleIcons = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return searchResults.slice(start, start + PAGE_SIZE)
  }, [page, searchResults])

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-[#111827]">Category icon</p>
        <p className="text-xs text-[#64748B]">{TRADE_ICON_NAMES.length} trade icons</p>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]"
          strokeWidth={2}
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search icons (plumb, drill, roof...)"
          className="h-10 w-full rounded-lg border border-[#E5E7EB] bg-white pr-3 pl-9 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
        />
      </div>

      {!isSearching ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
            Popular
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {POPULAR_ICON_NAMES.map((iconName) => (
              <IconPickerButton
                key={`popular-${iconName}`}
                iconName={iconName}
                selected={value === iconName}
                onSelect={onChange}
                compact
              />
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
            {isSearching ? 'Search results' : 'Browse icons'}
          </p>
          <p className="text-xs text-[#64748B]">
            {isSearching
              ? `${searchResults.length} matches`
              : `Page ${page} of ${totalPages}`}
          </p>
        </div>

        <div className="max-h-64 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-2">
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
            {visibleIcons.map((iconName) => (
              <IconPickerButton
                key={iconName}
                iconName={iconName}
                selected={value === iconName}
                onSelect={onChange}
                compact
              />
            ))}
          </div>

          {visibleIcons.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-[#64748B]">
              No icons match your search.
            </p>
          ) : null}
        </div>

        {totalPages > 1 ? (
          <div className="mt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#111827] transition-colors hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="size-3.5" />
              Previous
            </button>
            <span className="text-xs text-[#64748B]">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#111827] transition-colors hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function IconPickerButton({ iconName, selected, onSelect, compact = false }) {
  const label = formatIconLabel(iconName)

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={selected}
      onClick={() => onSelect(iconName)}
      className={cn(
        'flex flex-col items-center justify-center gap-1 rounded-xl border bg-white transition-colors',
        compact ? 'min-h-[44px] px-1 py-2' : 'px-2 py-2.5',
        selected
          ? 'border-btn-primary bg-[#EFF6FF] text-btn-primary'
          : 'border-[#E5E7EB] text-[#64748B] hover:border-[#CBD5E1] hover:bg-white',
      )}
    >
      <TradeIcon name={iconName} className="size-5" />
      {!compact ? (
        <span className="line-clamp-2 w-full text-center text-[10px] leading-3 font-medium">
          {label}
        </span>
      ) : null}
    </button>
  )
}
