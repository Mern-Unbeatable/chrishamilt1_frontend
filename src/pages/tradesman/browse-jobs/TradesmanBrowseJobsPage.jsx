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
import { usePagination } from '@/hooks/usePagination'
import {
  DEMO_BROWSE_JOB_CATEGORIES,
  DEMO_BROWSE_JOBS,
} from '@/data/demoData'

const PAGE_SIZE = 6

function filterByCategory(jobs, category) {
  if (category === DEMO_BROWSE_JOB_CATEGORIES[0]) return jobs
  return jobs.filter((job) => job.category === category)
}

export default function TradesmanBrowseJobsPage() {
  const navigate = useNavigate()
  const listRef = useRef(null)
  const [category, setCategory] = useState(DEMO_BROWSE_JOB_CATEGORIES[0])

  const filteredJobs = useMemo(
    () => filterByCategory(DEMO_BROWSE_JOBS, category),
    [category],
  )

  const { page, setPage, totalPages, paginatedItems } = usePagination(filteredJobs, PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [category, setPage])

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Browse jobs"
        description={`${filteredJobs.length} ${filteredJobs.length === 1 ? 'job' : 'jobs'} found`}
        actions={
          <Dropdown className="w-full sm:w-auto sm:min-w-[200px]">
            <DropdownTrigger className="h-10 w-full justify-between gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#111827] shadow-none transition-colors hover:bg-[#F8FAFC]">
              <span className="truncate">
                {category === DEMO_BROWSE_JOB_CATEGORIES[0] ? 'Category' : category}
              </span>
              <ChevronDown className="size-4 shrink-0 text-[#94A3B8]" strokeWidth={2} />
            </DropdownTrigger>
            <DropdownMenu align="right" className="min-w-[220px]">
              {DEMO_BROWSE_JOB_CATEGORIES.map((item) => (
                <DropdownItem key={item} onClick={() => setCategory(item)}>
                  {item}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        }
      />

      <div ref={listRef} className="scroll-mt-24">
        <div className="flex flex-col gap-4">
          {paginatedItems.length > 0 ? (
            paginatedItems.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                onViewLead={() => navigate(`/tradesman/browse-jobs/${job.id}`)}
              />
            ))
          ) : (
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-6 py-12 text-center">
              <p className="text-base font-semibold text-[#111827]">No jobs found</p>
              <p className="mt-2 text-sm text-[#64748B]">
                Try selecting a different category to see more leads.
              </p>
            </div>
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-8"
        />
      </div>
    </div>
  )
}
