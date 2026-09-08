import { useMemo } from 'react'
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
import {
  DEMO_TRADESMAN_REVENUE_CHART,
  DEMO_TRADESMAN_REVENUE_SUMMARY,
} from '@/data/tradesmanEarningsData'

function formatCurrency(value) {
  if (value >= 1000) {
    const amount = value / 1000
    return Number.isInteger(amount) ? `£${amount}k` : `£${amount.toFixed(1)}k`
  }
  return `£${value}`
}

function buildYAxisConfig(values = []) {
  const maxValue = Math.max(...values.map((value) => Number(value) || 0), 0)

  if (maxValue <= 0) {
    return {
      domain: [0, 1000],
      ticks: [0, 250, 500, 750, 1000],
    }
  }

  const paddedMax = Math.ceil((maxValue * 1.15) / 100) * 100
  const step = Math.max(100, Math.ceil(paddedMax / 4 / 100) * 100)
  const top = step * 4

  return {
    domain: [0, top],
    ticks: [0, step, step * 2, step * 3, top],
  }
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm">
      <p className="text-xs font-medium text-[#64748B]">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-[#111827]">
        £{Number(payload[0].value ?? 0).toLocaleString('en-GB')}
      </p>
    </div>
  )
}

export default function TradesmanRevenueChart({
  chartData = DEMO_TRADESMAN_REVENUE_CHART,
  revenueSummary = DEMO_TRADESMAN_REVENUE_SUMMARY,
}) {
  const { averageJobValue, completedJobs } = revenueSummary
  const yAxis = useMemo(
    () => buildYAxisConfig(chartData.map((item) => item.revenue)),
    [chartData],
  )

  return (
    <DashboardChartCard
      title="Revenue"
      subtitle={`Average job value ${averageJobValue} · ${completedJobs} completed jobs`}
    >
      <div className="h-[300px] w-full sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="tradesmanRevenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
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
              domain={yAxis.domain}
              ticks={yAxis.ticks}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#CBD5E1', strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={2.5}
              fill="url(#tradesmanRevenueFill)"
              dot={false}
              activeDot={{ r: 4, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardChartCard>
  )
}
