import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Briefcase, CalendarCheck, MessageSquare, Plus } from 'lucide-react'
import JobCard from '@/components/data-display/JobCard/JobCard'
import WalletStatCard from '@/components/data-display/WalletStatCard/WalletStatCard'
import PostedJobCard from '@/components/data-display/PostedJobCard'
import {
  fetchUserDashboard,
  getDemoUserDashboard,
  isUserDashboardApiEnabled,
} from '@/services/userDashboardApi'
import Cta from '@/pages/public/home/sections/Cta'

const DASHBOARD_ICONS = {
  briefcase: Briefcase,
  calendar: CalendarCheck,
  message: MessageSquare,
}

export default function UserDashboardPage() {
  const navigate = useNavigate()
  const useApi = isUserDashboardApiEnabled()
  const demoData = useMemo(() => getDemoUserDashboard(), [])

  const [stats, setStats] = useState(demoData.stats)
  const [recentJobs, setRecentJobs] = useState(demoData.recentJobs)
  const [recentBookings, setRecentBookings] = useState(demoData.recentBookings)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchUserDashboard()
        if (cancelled) return

        setStats(data.stats)
        setRecentJobs(data.recentJobs)
        setRecentBookings(data.recentBookings)
      } catch (err) {
        if (cancelled) return
        setError(err?.message || 'Unable to load dashboard.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [useApi])

  return (
    <>
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">Dashboard</h1>
                <p className="mt-1 text-sm text-[#64748B] lg:text-base">
                  Overview of your job posts, bookings, and messages.
                </p>
              </div>

              <Link
                to="/post-job"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-btn-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
              >
                <Plus className="size-4" />
                Post a job
              </Link>
            </div>

            {error ? (
              <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                {error}
              </p>
            ) : null}

            {loading ? (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
                <p className="text-sm text-[#64748B]">Loading dashboard…</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {stats.map((stat) => (
                    <WalletStatCard
                      key={stat.id}
                      label={stat.label}
                      value={stat.value}
                      subtext={stat.subtext}
                      icon={DASHBOARD_ICONS[stat.iconKey]}
                      iconTone={stat.iconTone}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <section className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-semibold text-[#111827]">Recent job posts</h2>
                      <Link to="/my-jobs" className="text-sm font-semibold text-btn-primary hover:underline">
                        View all
                      </Link>
                    </div>

                    {recentJobs.length ? (
                      recentJobs.map((job) => (
                        <PostedJobCard
                          key={job.id}
                          {...job}
                          onViewQuote={() => navigate(`/my-jobs/${job.id}/quotes`)}
                          onEdit={() => navigate(`/post-job/${job.id}`)}
                        />
                      ))
                    ) : (
                      <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-10 text-center">
                        <p className="text-sm text-[#64748B]">No job posts yet.</p>
                      </div>
                    )}
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-semibold text-[#111827]">Recent bookings</h2>
                      <Link to="/my-bookings" className="text-sm font-semibold text-btn-primary hover:underline">
                        View all
                      </Link>
                    </div>

                    {recentBookings.length ? (
                      recentBookings.map((booking) => (
                        <JobCard
                          key={booking.id}
                          variant="booking"
                          {...booking}
                          onOpen={() => navigate(`/my-bookings/${booking.id}`)}
                        />
                      ))
                    ) : (
                      <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-10 text-center">
                        <p className="text-sm text-[#64748B]">No bookings yet.</p>
                      </div>
                    )}
                  </section>
                </div>

                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-[#111827]">Quick links</h2>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to="/messages"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:border-btn-primary hover:text-btn-primary"
                    >
                      <MessageSquare className="size-4" />
                      Messages
                    </Link>
                    <Link
                      to="/my-jobs"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:border-btn-primary hover:text-btn-primary"
                    >
                      <Briefcase className="size-4" />
                      My job posts
                    </Link>
                    <Link
                      to="/my-bookings"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:border-btn-primary hover:text-btn-primary"
                    >
                      <CalendarCheck className="size-4" />
                      My bookings
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <Cta postJobTo="/post-job" />
    </>
  )
}
