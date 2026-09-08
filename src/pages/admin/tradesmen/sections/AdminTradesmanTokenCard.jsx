import { useState } from 'react'

const TOKEN_SUMMARY = [
  { key: 'purchased', label: 'Purchased', tone: 'bg-[#EFF6FF] text-[#2563EB]' },
  { key: 'used', label: 'Used', tone: 'bg-[#FEFCE8] text-[#CA8A04]' },
  { key: 'remaining', label: 'Remaining', tone: 'bg-[#ECFDF5] text-[#059669]' },
]

export default function AdminTradesmanTokenCard({ tokens, onGrantTokens, granting = false }) {
  const [amount, setAmount] = useState('')

  const usagePercent =
    tokens.purchased > 0 ? Math.round((tokens.used / tokens.purchased) * 100) : 0

  const handleGrant = async () => {
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0 || !onGrantTokens) return

    const success = await onGrantTokens(value)
    if (success) setAmount('')
  }

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
      <h2 className="text-base font-semibold text-[#111827]">Token Management</h2>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {TOKEN_SUMMARY.map((item) => (
          <div
            key={item.key}
            className={`rounded-xl px-3 py-4 text-center sm:px-4 ${item.tone}`}
          >
            <p className="text-2xl font-bold">{tokens[item.key]}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] opacity-80">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-[#111827]">Token Usage</span>
          <span className="text-[#64748B]">{usagePercent}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#F1F5F9]">
          <div
            className="h-full rounded-full bg-btn-primary transition-all"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-[#64748B]">
          <span>{tokens.used} used</span>
          <span>
            {tokens.remaining} remaining of {tokens.purchased}
          </span>
        </div>
      </div>

      {onGrantTokens ? (
        <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
          <p className="text-sm font-semibold text-[#111827]">Grant tokens</p>
          <p className="mt-1 text-xs text-[#64748B]">
            Add tokens directly to this tradesman&apos;s wallet.
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Amount"
              className="h-10 flex-1 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] outline-none focus:border-btn-primary"
            />
            <button
              type="button"
              disabled={granting || !Number(amount) || Number(amount) <= 0}
              onClick={handleGrant}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-btn-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:opacity-60"
            >
              {granting ? 'Granting…' : 'Grant tokens'}
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
          Purchase History
        </p>
        {!tokens.history || tokens.history.length === 0 ? (
          <p className="mt-2.5 text-xs text-[#64748B]">No purchase history recorded.</p>
        ) : (
          <ul className="mt-2.5 space-y-2.5">
            {tokens.history.map((entry) => (
              <li
                key={entry.id}
                className="flex items-start justify-between gap-4 border-b border-[#F1F5F9] pb-2.5 last:border-b-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#111827]">{entry.name}</p>
                  <p className="mt-0.5 text-xs text-[#64748B]">{entry.date}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-[#111827]">{entry.price}</p>
                  <p className="mt-0.5 text-xs text-[#64748B]">
                    {entry.tokens.toLocaleString()} tokens
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-4 border-t border-[#F1F5F9] pt-3 text-sm text-[#64748B]">
        Total spent on tokens{' '}
        <span className="font-semibold text-[#111827]">{tokens.totalSpent}</span>
      </p>
    </section>
  )
}
