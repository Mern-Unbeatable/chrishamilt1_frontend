import { ChevronLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import JobDetails from '@/components/data-display/JobDetails'
import { DEMO_BROWSE_JOBS, DEMO_JOB_DETAILS } from '@/data/demoData'
import JobDetailsCustomer from '@/pages/public/jobs/sections/JobDetailsCustomer'
import JobDetailsSummary from '@/pages/public/jobs/sections/JobDetailsSummary'

function buildJobDetails(job) {
  if (job.id === '1') {
    return { ...DEMO_JOB_DETAILS }
  }

  return {
    ...DEMO_JOB_DETAILS,
    id: job.id,
    title: job.title,
    location: job.location,
    price: job.priceRange,
    category: job.category,
    postedAt: job.postedAt,
  }
}

export default function AdminJobDetailsPage() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const browseJob = DEMO_BROWSE_JOBS.find((item) => item.id === jobId)

  if (!browseJob) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/jobs"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
        >
          <ChevronLeft className="size-4 shrink-0" strokeWidth={2} />
          Back
        </Link>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-12 text-center">
          <p className="text-base font-semibold text-[#111827]">Job not found</p>
          <p className="mt-2 text-sm text-[#64748B]">
            This job may have been removed or is no longer available.
          </p>
          <Link
            to="/admin/jobs"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-btn-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
          >
            Back to jobs
          </Link>
        </div>
      </div>
    )
  }

  const job = buildJobDetails(browseJob)

  return (
    <div className="space-y-4">
      <Link
        to="/admin/jobs"
        className="inline-flex items-center gap-1 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
      >
        <ChevronLeft className="size-4 shrink-0" strokeWidth={2} />
        Back
      </Link>

      <JobDetailsSummary
        job={job}
        sendQuoteLabel="View Quote"
        onSendQuote={() => navigate(`/admin/jobs/${jobId}/quotes`)}
      />
      <JobDetailsCustomer customer={job.customer} />
      <JobDetails job={job} showSummary={false} showTradesman={false} />
    </div>
  )
}
