import { ChevronLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import JobDetails from '@/components/data-display/JobDetails'
import { DEMO_JOB_DETAILS } from '@/data/demoData'
import { getTradesmanJob } from '@/data/tradesmanJobsData'
import JobDetailsCustomer from '@/pages/public/jobs/sections/JobDetailsCustomer'
import JobDetailsSummary from '@/pages/public/jobs/sections/JobDetailsSummary'

function buildJobDetails(job) {
  return {
    ...DEMO_JOB_DETAILS,
    id: job.id,
    title: `Project for ${job.customerName}`,
    location: DEMO_JOB_DETAILS.location,
    price: job.price,
    status: job.status,
    statusVariant:
      job.status.toLowerCase() === 'completed'
        ? 'completed'
        : job.status.toLowerCase() === 'accepted'
          ? 'open'
          : 'inProgress',
    customer: {
      ...DEMO_JOB_DETAILS.customer,
      name: job.customerName,
      phone: job.phoneNumber,
    },
  }
}

export default function TradesmanJobDetailsPage() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const tradesmanJob = getTradesmanJob(jobId)

  if (!tradesmanJob) {
    return (
      <div className="space-y-6">
        <Link
          to="/tradesman/jobs"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
        >
          <ChevronLeft className="size-4 shrink-0" strokeWidth={2} />
          Back
        </Link>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-12 text-center">
          <p className="text-base font-semibold text-[#111827]">Job not found</p>
          <p className="mt-2 text-sm text-[#64748B]">
            This job may have been removed or is no longer assigned to you.
          </p>
          <Link
            to="/tradesman/jobs"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-btn-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
          >
            Back to my jobs
          </Link>
        </div>
      </div>
    )
  }

  const job = buildJobDetails(tradesmanJob)

  return (
    <div className="space-y-6">
      <Link
        to="/tradesman/jobs"
        className="inline-flex items-center gap-1 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
      >
        <ChevronLeft className="size-4 shrink-0" strokeWidth={2} />
        Back
      </Link>

      <JobDetailsSummary job={job} />
      <JobDetailsCustomer customer={job.customer} />

      <JobDetails
        job={job}
        showSummary={false}
        showTradesman={false}
        onMessage={() => navigate('/tradesman/messages')}
      />
    </div>
  )
}
