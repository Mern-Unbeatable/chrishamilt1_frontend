import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import JobCard from '@/components/data-display/JobCard/JobCard'
import { DEMO_RECENT_JOBS } from '@/data/demoData'
import {
  fetchPublicJobs,
  isPublicJobsApiEnabled,
  PUBLIC_JOBS_PAGE_SIZE,
} from '@/services/publicJobsApi'

const browseAllJobsBtn =
  'inline-flex shrink-0 items-center justify-center rounded-lg bg-btn-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]'

export default function RecentJobs() {
  const navigate = useNavigate()
  const useApi = isPublicJobsApiEnabled()

  const [jobs, setJobs] = useState(useApi ? [] : DEMO_RECENT_JOBS)
  const [loading, setLoading] = useState(useApi)

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    async function loadJobs() {
      setLoading(true)

      try {
        const result = await fetchPublicJobs({
          page: 1,
          limit: PUBLIC_JOBS_PAGE_SIZE,
        })

        if (!cancelled) setJobs(result.jobs)
      } catch {
        if (!cancelled) setJobs(DEMO_RECENT_JOBS)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadJobs()

    return () => {
      cancelled = true
    }
  }, [useApi])

  return (
    <section data-scroll-section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div
          data-scroll-header
          className="sm:flex sm:items-end sm:justify-between sm:gap-6"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] text-[var(--primary-text)] sm:text-4xl">
              Recent Jobs
            </h2>
            <p className="mt-2 text-base text-[var(--secondary-text)]">
              Latest opportunities for tradesmen
            </p>
          </div>

          <Link to="/jobs" className={`${browseAllJobsBtn} max-sm:hidden`}>
            Browse All Jobs
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          {loading ? (
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-6 py-12 text-center">
              <p className="text-sm text-[#64748B]">Loading recent jobs…</p>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} data-scroll-item>
                <JobCard
                  {...job}
                  onViewLead={() => navigate(`/jobs/${job.id}`)}
                />
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-6 py-12 text-center">
              <p className="text-sm text-[#64748B]">No jobs available right now.</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Link to="/jobs" className={browseAllJobsBtn}>
            Browse All Jobs
          </Link>
        </div>
      </div>
    </section>
  )
}
