import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Pagination from '@/components/common/Pagination/Pagination'
import PostedJobCard from '@/components/data-display/PostedJobCard'
import { cn } from '@/helpers/cn'
import {
  showApiErrorFromError,
  showConfirmAlert,
  showSuccessAlert,
} from '@/helpers/showAppAlert'
import { DEMO_MY_JOBS } from '@/data/myJobsData'
import Cta from '@/pages/public/home/sections/Cta'
import {
  deleteUserJob,
  fetchMyJobs,
  isUserJobsApiEnabled,
  MY_JOB_STATUS_FILTERS,
  MY_JOBS_PAGE_SIZE,
} from '@/services/userJobsApi'

const PAGE_SIZE = MY_JOBS_PAGE_SIZE

export default function MyJobsPage() {
  const navigate = useNavigate()
  const listRef = useRef(null)
  const useApi = isUserJobsApiEnabled()

  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [jobs, setJobs] = useState(useApi ? [] : DEMO_MY_JOBS)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(useApi ? 0 : DEMO_MY_JOBS.length)
  const [loading, setLoading] = useState(useApi)
  const [deletingId, setDeletingId] = useState('')
  const [error, setError] = useState('')

  const demoPaginatedJobs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return jobs.slice(start, start + PAGE_SIZE)
  }, [jobs, page])

  useEffect(() => {
    setPage(1)
  }, [statusFilter])

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    async function loadJobs() {
      setLoading(true)
      setError('')

      try {
        const result = await fetchMyJobs({
          status: statusFilter,
          page,
          limit: PAGE_SIZE,
        })

        if (cancelled) return

        setJobs(result.jobs)
        setTotalCount(result.pagination.total ?? result.jobs.length)
        setTotalPages(Math.max(1, result.pagination.totalPages ?? 1))
      } catch (err) {
        if (cancelled) return

        setJobs([])
        setTotalCount(0)
        setTotalPages(1)
        setError(err?.message || 'Unable to load your job posts right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadJobs()

    return () => {
      cancelled = true
    }
  }, [useApi, statusFilter, page])

  useEffect(() => {
    if (useApi) return
    const nextTotalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE))
    if (page > nextTotalPages) setPage(nextTotalPages)
  }, [useApi, jobs.length, page])

  const displayJobs = useApi ? jobs : demoPaginatedJobs
  const displayTotalCount = useApi ? totalCount : jobs.length
  const displayTotalPages = useApi
    ? totalPages
    : Math.max(1, Math.ceil(jobs.length / PAGE_SIZE))
  const hasJobs = useApi ? totalCount > 0 : jobs.length > 0

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleDelete = async (job) => {
    const confirmation = await showConfirmAlert({
      title: 'Delete job post?',
      text: `"${job.title}" will be permanently removed.`,
      confirmButtonText: 'Delete job',
      cancelButtonText: 'Keep job',
    })

    if (!confirmation.isConfirmed) return

    if (!useApi) {
      setJobs((current) => current.filter((item) => item.id !== job.id))
      return
    }

    setDeletingId(job.id)

    try {
      await deleteUserJob(job.id)

      const targetPage = jobs.length === 1 && page > 1 ? page - 1 : page
      const result = await fetchMyJobs({
        status: statusFilter,
        page: targetPage,
        limit: PAGE_SIZE,
      })

      setJobs(result.jobs)
      setTotalCount(result.pagination.total ?? result.jobs.length)
      setTotalPages(Math.max(1, result.pagination.totalPages ?? 1))

      if (targetPage !== page) {
        setPage(targetPage)
      }

      await showSuccessAlert({
        title: 'Job deleted',
        text: 'Your job post has been removed.',
      })
    } catch (err) {
      await showApiErrorFromError(err, 'Unable to delete job')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <>
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={listRef} className="mx-auto max-w-4xl scroll-mt-24">
            <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">My Job Post</h1>
            <p className="mt-1 text-sm text-[#64748B] lg:text-base">
              Manage your posted jobs and view quotes from tradesmen.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {MY_JOB_STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.value || 'all'}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    statusFilter === filter.value
                      ? 'bg-btn-primary text-white'
                      : 'border border-[#E5E7EB] bg-white text-[#64748B] hover:border-btn-primary hover:text-btn-primary',
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {error ? (
              <p className="mt-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                {error}
              </p>
            ) : null}

            {loading ? (
              <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
                <p className="text-sm text-[#64748B]">Loading your job posts…</p>
              </div>
            ) : hasJobs ? (
              <>
                <p className="mt-4 text-sm font-medium text-btn-primary">
                  {displayTotalCount} {displayTotalCount === 1 ? 'job' : 'jobs'} found
                </p>

                <div className="mt-6 space-y-4">
                  {displayJobs.map((job) => (
                    <PostedJobCard
                      key={job.id}
                      {...job}
                      onViewQuote={() => navigate(`/my-jobs/${job.id}/quotes`)}
                      onEdit={() => navigate(`/post-job/${job.id}`)}
                      onDelete={deletingId === job.id ? undefined : () => handleDelete(job)}
                    />
                  ))}
                </div>

                <Pagination
                  page={page}
                  totalPages={displayTotalPages}
                  onPageChange={handlePageChange}
                  className="mt-8"
                />
              </>
            ) : (
              <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
                <p className="text-base font-semibold text-[#111827]">No job posts yet</p>
                <p className="mt-2 text-sm text-[#64748B]">
                  {statusFilter
                    ? 'No jobs match this status filter. Try another filter or post a new job.'
                    : 'Post your first job to start receiving verified quotes.'}
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/post-job')}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-btn-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
                >
                  Post a Job
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <Cta postJobTo="/post-job" />
    </>
  )
}
