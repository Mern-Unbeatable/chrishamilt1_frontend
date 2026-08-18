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

export default function AdminJobsCompletedChart() {
  return (
    <DashboardChartCard title="Jobs Completed" subtitle="Monthly delivery volume" className="h-full">
      <div className="h-[280px] w-full sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={DEMO_ADMIN_JOBS_COMPLETED}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
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
              domain={[0, 12]}
              ticks={[0, 3, 6, 9, 12]}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F8FAFC' }} />
            <Bar dataKey="jobs" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardChartCard>
  )
}
