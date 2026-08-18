import DashboardChartCard from '@/components/dashboard/DashboardChartCard'
import { DEMO_ADMIN_TOP_TOKEN_BUYERS } from '@/data/adminDashboardData'

export default function AdminTopTokenBuyers() {
  return (
    <DashboardChartCard title="Top Token Buyers" subtitle="Highest volume this month" className="self-start">
      <ul className="space-y-4">
        {DEMO_ADMIN_TOP_TOKEN_BUYERS.map((buyer, index) => (
          <li key={buyer.id}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-bold text-btn-primary">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-[#111827]">{buyer.name}</p>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-[#111827]">{buyer.amount}</p>
                    <p className="text-xs text-[#64748B]">{buyer.tokens.toLocaleString()} tokens</p>
                  </div>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F1F5F9]">
                  <div
                    className="h-full rounded-full bg-btn-primary transition-all"
                    style={{ width: `${buyer.volume}%` }}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </DashboardChartCard>
  )
}
