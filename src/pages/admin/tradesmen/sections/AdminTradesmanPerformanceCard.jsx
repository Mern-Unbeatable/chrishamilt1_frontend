const HIGHLIGHT_STATS = [
  { key: 'totalEarned', label: 'Total Earned', tone: 'bg-[#ECFDF5] text-[#059669]' },
  { key: 'jobsCompleted', label: 'Jobs Completed', tone: 'bg-[#EFF6FF] text-[#2563EB]' },
  { key: 'quoteWinRate', label: 'Quote Win Rate', tone: 'bg-[#F5F3FF] text-[#7C3AED]' },
  { key: 'avgJobValue', label: 'Avg Job Value', tone: 'bg-[#FEFCE8] text-[#CA8A04]' },
]

const DETAIL_ROWS = [
  { key: 'memberSince', label: 'Member since' },
  { key: 'totalQuotesSent', label: 'Total quotes sent' },
  { key: 'jobsWon', label: 'Jobs won' },
  { key: 'tokensPurchased', label: 'Tokens purchased' },
  { key: 'tokensRemaining', label: 'Tokens remaining' },
]

export default function AdminTradesmanPerformanceCard({ stats, memberSince }) {
  const values = { ...stats, memberSince }

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {HIGHLIGHT_STATS.map((item) => (
          <div key={item.key} className={`rounded-xl px-3 py-3 sm:px-4 ${item.tone}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] opacity-80">
              {item.label}
            </p>
            <p className="mt-2 text-xl font-bold sm:text-2xl">{values[item.key]}</p>
          </div>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-2.5 border-t border-[#F1F5F9] pt-4 sm:grid-cols-2">
        {DETAIL_ROWS.map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4 text-sm">
            <dt className="text-[#64748B]">{row.label}</dt>
            <dd className="font-semibold text-[#111827]">{values[row.key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
