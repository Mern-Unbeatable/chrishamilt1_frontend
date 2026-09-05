import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import DashboardChartCard from '@/components/dashboard/DashboardChartCard'
import { DEMO_ADMIN_JOBS_COMPLETED } from '@/data/adminDashboardData'

function getYAxisMax(data) {
  const max = Math.max(...data.map((item) => item.jobs ?? 0), 0)
  if (max === 0) return 12

  const step = max <= 12 ? 3 : max <= 50 ? 10 : 25
  return Math.ceil(max / step) * step
}

function buildTicks(max) {
  const step = max / 4
  return [0, step, step * 2, step * 3, max].map((value) => Math.round(value))
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm">
      <p className="text-xs font-medium text-[#64748B]">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-[#111827]">
        {payload[0].value} jobs
      </p>
    </div>
  )
}

export default function AdminJobsCompletedChart({ data = DEMO_ADMIN_JOBS_COMPLETED }) {
  const yMax = getYAxisMax(data)
  const ticks = buildTicks(yMax)

  return (
    <DashboardChartCard title="Jobs Completed" subtitle="Monthly delivery volume" className="h-full">
      <div className="h-[280px] w-full sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
              width={32}
              domain={[0, yMax]}
              ticks={ticks}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F8FAFC' }} />
            <Bar dataKey="jobs" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardChartCard>
  )
}
