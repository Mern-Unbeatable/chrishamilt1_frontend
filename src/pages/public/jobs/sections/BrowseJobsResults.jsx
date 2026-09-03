import { useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import JobCard from '@/components/data-display/JobCard/JobCard'
import Pagination from '@/components/common/Pagination/Pagination'

export default function BrowseJobsResults({
  jobs,
  totalCount,
  keyword,
  onKeywordChange,
  page,
  totalPages,
  onPageChange,
  loading = false,
  error = '',
}) {
  const navigate = useNavigate()
  const resultsRef = useRef(null)

  const handlePageChange = (nextPage) => {
    onPageChange(nextPage)
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      ref={resultsRef}
      data-scroll-section
      className="scroll-mt-24 bg-[#F8FAFC] py-12 lg:py-16"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div data-scroll-header>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            Browse Jobs
          </h2>
          <p className="mt-2 text-base text-[#64748B]">
            Find the right job leads for your business
          </p>
        </div>

        <div className="relative mt-8">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#94A3B8]"
            strokeWidth={2}
          />
          <input
            type="search"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Search by keyword..."
            className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white pr-4 pl-12 text-sm text-[#111827] shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
          />
        </div>

        <p className="mt-4 text-sm font-medium text-btn-primary">
          {loading ? 'Loading jobs…' : `${totalCount} ${totalCount === 1 ? 'job' : 'jobs'} found`}
        </p>

        {error ? (
          <p className="mt-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-4">
          {loading ? (
            <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-12 text-center">
              <p className="text-sm text-[#64748B]">Fetching the latest job leads…</p>
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
            <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-12 text-center">
              <p className="text-base font-semibold text-[#111827]">No jobs found</p>
              <p className="mt-2 text-sm text-[#64748B]">
                Try adjusting your filters or search keyword.
              </p>
            </div>
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-10"
        />

        <div data-scroll-item className="mt-10 rounded-2xl bg-btn-primary px-6 py-10 text-center sm:px-10">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            Want to bid on these jobs?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/90 sm:text-base">
            Join as a verified tradesman to unlock full job details and submit quotes.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/auth/signup"
              className="inline-flex min-w-[180px] items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-btn-primary transition-colors hover:bg-[#F8FAFC]"
            >
              Join as Tradesman
            </Link>
            <Link
              to="/auth/login"
              className="inline-flex min-w-[180px] items-center justify-center rounded-lg border border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
