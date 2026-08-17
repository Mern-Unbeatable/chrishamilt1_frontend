import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Pagination from '@/components/common/Pagination/Pagination'
import PostedJobCard from '@/components/data-display/PostedJobCard'
import { usePagination } from '@/hooks/usePagination'
import { DEMO_MY_JOBS } from '@/data/myJobsData'
import Cta from '@/pages/public/home/sections/Cta'

const PAGE_SIZE = 3

export default function MyJobsPage() {
  const navigate = useNavigate()
  const listRef = useRef(null)
  const [jobs, setJobs] = useState(DEMO_MY_JOBS)
  const { page, setPage, totalPages, paginatedItems } = usePagination(jobs, PAGE_SIZE)

  const handleDelete = (id) => {
    setJobs((current) => current.filter((job) => job.id !== id))
  }

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={listRef} className="mx-auto max-w-4xl scroll-mt-24">
            <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">My Job Post</h1>
            <p className="mt-1 text-sm lg:text-base text-[#64748B]">
              Manage your posted jobs and view quotes from tradesmen.
            </p>

            {jobs.length > 0 ? (
              <>
                <div className="mt-6 space-y-4">
                  {paginatedItems.map((job) => (
                    <PostedJobCard
                      key={job.id}
                      {...job}
                      onViewQuote={() => navigate(`/my-jobs/${job.id}/quotes`)}
                      onEdit={() => navigate('/post-job')}
                      onDelete={() => handleDelete(job.id)}
                    />
                  ))}
                </div>

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="mt-8"
                />
              </>
            ) : (
              <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
                <p className="text-base font-semibold text-[#111827]">No job posts yet</p>
                <p className="mt-2 text-sm text-[#64748B]">
                  Post your first job to start receiving verified quotes.
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
