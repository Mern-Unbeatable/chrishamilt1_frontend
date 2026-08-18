import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import DashboardChartCard from '@/components/dashboard/DashboardChartCard'
import { DEMO_ADMIN_MONTHLY_EARNINGS } from '@/data/adminDashboardData'

function formatCurrency(value) {
  if (value >= 1000) {
    const amount = value / 1000
    return Number.isInteger(amount) ? `£${amount}k` : `£${amount.toFixed(1)}k`
  }
  return `£${value}`
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm">
      <p className="text-xs font-medium text-[#64748B]">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-[#111827]">
        £{payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

export default function AdminMonthlyEarningsChart() {
  return (
    <DashboardChartCard title="Monthly Earnings" subtitle="Platform revenue, last 12 months" className="h-full">
      <div className="h-[280px] w-full sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={DEMO_ADMIN_MONTHLY_EARNINGS}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="adminEarningsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              tickFormatter={formatCurrency}
              width={52}
              domain={[0, 10000]}
              ticks={[0, 2500, 5000, 7500, 10000]}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#CBD5E1', strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              fill="url(#adminEarningsFill)"
              dot={false}
              activeDot={{ r: 4, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardChartCard>
  )
}
