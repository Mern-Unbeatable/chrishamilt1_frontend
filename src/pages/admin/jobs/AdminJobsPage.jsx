import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router'
import Pagination from '@/components/common/Pagination/Pagination'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@/components/Dropdown'
import JobCard from '@/components/data-display/JobCard/JobCard'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import {
  DEMO_BROWSE_JOB_CATEGORIES,
  DEMO_BROWSE_JOBS,
} from '@/data/demoData'
import {
  ALL_CATEGORIES_OPTION,
  fetchJobCategories,
  fetchPublicJobs,
  getFallbackJobCategories,
  isPublicJobsApiEnabled,
  PUBLIC_JOBS_PAGE_SIZE,
} from '@/services/publicJobsApi'

const PAGE_SIZE = PUBLIC_JOBS_PAGE_SIZE

function filterByCategory(jobs, categoryLabel) {
  if (categoryLabel === DEMO_BROWSE_JOB_CATEGORIES[0]) return jobs
  return jobs.filter((job) => job.category === categoryLabel)
}

export default function AdminJobsPage() {
  const navigate = useNavigate()
  const listRef = useRef(null)
  const useApi = isPublicJobsApiEnabled()

  const [categories, setCategories] = useState(() =>
    useApi
      ? getFallbackJobCategories()
      : DEMO_BROWSE_JOB_CATEGORIES.map((label) => ({
          label,
          slug: label === DEMO_BROWSE_JOB_CATEGORIES[0] ? '' : label,
        })),
  )
  const [categorySlug, setCategorySlug] = useState('')
  const [page, setPage] = useState(1)
  const [jobs, setJobs] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')

  const selectedCategory =
    categories.find((item) => item.slug === categorySlug) ??
    categories[0] ??
    ALL_CATEGORIES_OPTION

  const demoFilteredJobs = useMemo(
    () => filterByCategory(DEMO_BROWSE_JOBS, selectedCategory.label),
    [selectedCategory.label],
  )

  const demoPaginatedJobs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return demoFilteredJobs.slice(start, start + PAGE_SIZE)
  }, [demoFilteredJobs, page])

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    fetchJobCategories()
      .then((nextCategories) => {
        if (!cancelled) setCategories(nextCategories)
      })
      .catch(() => {
        if (!cancelled) setCategories(getFallbackJobCategories())
      })

    return () => {
      cancelled = true
    }
  }, [useApi])

  useEffect(() => {
    setPage(1)
  }, [categorySlug])

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    async function loadJobs() {
      setLoading(true)
      setError('')

      try {
        const result = await fetchPublicJobs({
          categorySlug,
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
        setError(err?.message || 'Unable to load jobs right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadJobs()

    return () => {
      cancelled = true
    }
  }, [useApi, categorySlug, page])

  useEffect(() => {
    if (useApi) return
    const nextTotalPages = Math.max(1, Math.ceil(demoFilteredJobs.length / PAGE_SIZE))
    if (page > nextTotalPages) setPage(nextTotalPages)
  }, [useApi, demoFilteredJobs.length, page])

  const displayJobs = useApi ? jobs : demoPaginatedJobs
  const displayTotalCount = useApi ? totalCount : demoFilteredJobs.length
  const displayTotalPages = useApi
    ? totalPages
    : Math.max(1, Math.ceil(demoFilteredJobs.length / PAGE_SIZE))

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const categoryLabel =
    selectedCategory.label === ALL_CATEGORIES_OPTION.label
      ? 'Category'
      : selectedCategory.label

  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Jobs"
        description="Browse every job posted on the platform. Switch between table and Kanban views to track progress."
        actions={
          <Dropdown className="w-full sm:w-auto sm:min-w-[200px]">
            <DropdownTrigger className="h-10 w-full justify-between gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#111827] shadow-none transition-colors hover:bg-[#F8FAFC]">
              <span className="truncate">{categoryLabel}</span>
              <ChevronDown className="size-4 shrink-0 text-[#94A3B8]" strokeWidth={2} />
            </DropdownTrigger>
            <DropdownMenu align="right" className="min-w-[220px]">
              {categories.map((item) => (
                <DropdownItem key={item.slug || item.label} onClick={() => setCategorySlug(item.slug)}>
                  {item.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        }
      />

      {error ? (
        <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
          <p className="text-sm text-[#64748B]">Loading jobs…</p>
        </div>
      ) : (
        <>
          <p className="text-sm font-medium text-btn-primary">
            {displayTotalCount} {displayTotalCount === 1 ? 'job' : 'jobs'} found
          </p>

          <div ref={listRef} className="scroll-mt-24">
            <div className="flex flex-col gap-4">
              {displayJobs.length > 0 ? (
                displayJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    {...job}
                    onViewLead={() => navigate(`/admin/jobs/${job.id}`)}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-6 py-12 text-center">
                  <p className="text-base font-semibold text-[#111827]">No jobs found</p>
                  <p className="mt-2 text-sm text-[#64748B]">
                    Try selecting a different category to see more jobs.
                  </p>
                </div>
              )}
            </div>

            <Pagination
              page={page}
              totalPages={displayTotalPages}
              onPageChange={handlePageChange}
              className="mt-6"
            />
          </div>
        </>
      )}
    </div>
  )
}
