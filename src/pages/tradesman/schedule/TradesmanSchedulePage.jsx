import { useEffect, useState } from 'react'
import { CalendarDays, Clock, MapPin, User } from 'lucide-react'
import { Link } from 'react-router'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import {
  fetchTradesmanSchedule,
  getDemoTradesmanSchedule,
  isTradesmanScheduleApiEnabled,
} from '@/services/tradesmanScheduleApi'

function ScheduleItem({ item }) {
  return (
    <Link
      to={`/tradesman/jobs/${item.jobId}`}
      className="block rounded-xl border border-[#E5E7EB] bg-white p-4 transition-colors hover:border-btn-primary sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-btn-primary">
            {item.jobCode}
          </p>
          <h3 className="mt-1 text-base font-semibold text-[#111827] sm:text-lg">{item.title}</h3>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#64748B]">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-4 shrink-0" />
              {item.customerName}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" />
              {item.location}
            </span>
          </div>
        </div>

        <div className="shrink-0 rounded-lg bg-[#EFF6FF] px-4 py-3 text-right">
          <p className="inline-flex items-center justify-end gap-1.5 text-sm font-semibold text-[#111827]">
            <Clock className="size-4 text-btn-primary" />
            {item.time}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#64748B]">
            {item.status}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default function TradesmanSchedulePage() {
  const useApi = isTradesmanScheduleApiEnabled()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!useApi) {
      setGroups(getDemoTradesmanSchedule())
      setLoading(false)
      return undefined
    }

    let cancelled = false

    async function loadSchedule() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchTradesmanSchedule()
        if (!cancelled) setGroups(data)
      } catch (err) {
        if (!cancelled) {
          setGroups([])
          setError(err?.message || 'Unable to load schedule.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadSchedule()

    return () => {
      cancelled = true
    }
  }, [useApi])

  const totalItems = groups.reduce((count, group) => count + group.items.length, 0)

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Schedule"
        description={
          loading
            ? 'Loading upcoming appointments…'
            : `${totalItems} upcoming appointment${totalItems === 1 ? '' : 's'}`
        }
      />

      {error ? (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-4">
          <p className="text-sm font-semibold text-[#B91C1C]">{error}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
          <p className="text-sm text-[#64748B]">Loading schedule…</p>
        </div>
      ) : totalItems === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
          <CalendarDays className="mx-auto size-10 text-[#94A3B8]" />
          <p className="mt-4 text-base font-semibold text-[#111827]">No upcoming appointments</p>
          <p className="mt-2 text-sm text-[#64748B]">
            Scheduled jobs will appear here once customers hire you and a start date is set.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.dateKey} className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#64748B]">
                {group.label}
              </h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <ScheduleItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
