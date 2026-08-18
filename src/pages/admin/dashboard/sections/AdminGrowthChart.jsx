import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import DashboardChartCard from '@/components/dashboard/DashboardChartCard'
import { DEMO_ADMIN_GROWTH } from '@/data/adminDashboardData'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm">
      <p className="text-xs font-medium text-[#64748B]">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="mt-0.5 text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export default function AdminGrowthChart() {
  return (
    <DashboardChartCard
      title="Customer & Tradesman Growth"
      subtitle="New registrations, last 12 months"
      className="h-full"
    >
      <div className="h-[280px] w-full sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={DEMO_ADMIN_GROWTH}
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
              width={40}
              domain={[0, 600]}
              ticks={[0, 150, 300, 450, 600]}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#CBD5E1', strokeDasharray: '4 4' }} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: '#64748B', paddingTop: 12 }}
            />
            <Line
              type="monotone"
              dataKey="customers"
              name="Customers"
              stroke="#2563EB"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="tradesmen"
              name="Tradesmen"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardChartCard>
  )
}
